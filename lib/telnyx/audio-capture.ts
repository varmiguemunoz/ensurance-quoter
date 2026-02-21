/* ------------------------------------------------------------------ */
/*  Audio Capture                                                      */
/*  Captures local mic + remote stream via Web Audio API.              */
/*  Outputs PCM Int16 at 16kHz mono for Deepgram transcription.        */
/*  No network calls — pure audio processing.                          */
/* ------------------------------------------------------------------ */

const TARGET_SAMPLE_RATE = 16_000

export interface AudioCaptureHandle {
  /** Stop capture, disconnect all nodes, close AudioContext. */
  stop: () => void
}

/**
 * Start capturing audio from both sides of a call.
 *
 * Mixes local (agent mic) and remote (client) streams into mono,
 * downsamples to 16kHz, and converts to PCM Int16.
 *
 * Multiple sources connected to the same ScriptProcessorNode input
 * are automatically summed by the Web Audio API.
 *
 * Returns a no-op handle if either stream is missing or has no audio tracks.
 *
 * @param localStream  Agent's microphone MediaStream
 * @param remoteStream Remote party's MediaStream
 * @param onChunk      Called with PCM Int16 chunks (~1365 samples at 16kHz per 4096-sample buffer at 48kHz)
 */
export function startCapture(
  localStream: MediaStream | null,
  remoteStream: MediaStream | null,
  onChunk: (pcm: Int16Array) => void,
): AudioCaptureHandle {
  const noop: AudioCaptureHandle = { stop: () => {} }

  if (!localStream || !remoteStream) return noop
  if (!localStream.getAudioTracks().length || !remoteStream.getAudioTracks().length) {
    return noop
  }

  const ctx = new AudioContext()
  const nativeSampleRate = ctx.sampleRate

  // Source nodes for both sides of the call
  const localSource = ctx.createMediaStreamSource(localStream)
  const remoteSource = ctx.createMediaStreamSource(remoteStream)

  // ScriptProcessorNode for raw PCM access
  // inputChannels=1 forces mono downmix from stereo sources
  // bufferSize 4096 @ 48kHz ≈ 85ms per callback
  const processor = ctx.createScriptProcessor(4096, 1, 1)

  let stopped = false

  processor.onaudioprocess = (event: AudioProcessingEvent) => {
    if (stopped) return

    try {
      const input = event.inputBuffer.getChannelData(0)

      // Downsample from native rate to 16kHz
      const downsampled =
        nativeSampleRate === TARGET_SAMPLE_RATE
          ? input
          : downsample(input, nativeSampleRate, TARGET_SAMPLE_RATE)

      // Convert Float32 [-1, 1] to Int16 [-32768, 32767]
      onChunk(floatToInt16(downsampled))
    } catch {
      // Prevent a callback error from killing the audio pipeline
    }
  }

  // Connect both sources to processor (auto-summed at input)
  // No connection to ctx.destination — onaudioprocess fires regardless,
  // and we don't want to echo mixed audio through the speakers.
  localSource.connect(processor)
  remoteSource.connect(processor)

  const stop = () => {
    if (stopped) return
    stopped = true

    processor.onaudioprocess = null

    try {
      localSource.disconnect()
    } catch {
      /* already disconnected */
    }
    try {
      remoteSource.disconnect()
    } catch {
      /* already disconnected */
    }
    try {
      processor.disconnect()
    } catch {
      /* already disconnected */
    }

    ctx.close().catch(() => {
      /* context may already be closed */
    })
  }

  return { stop }
}

/**
 * Downsample audio buffer using linear interpolation.
 *
 * Example: 4096 samples @ 48kHz → ~1365 samples @ 16kHz (ratio 3:1)
 */
function downsample(
  buffer: Float32Array,
  fromRate: number,
  toRate: number,
): Float32Array {
  if (buffer.length === 0) return new Float32Array(0)

  const ratio = fromRate / toRate
  const newLength = Math.floor(buffer.length / ratio)
  if (newLength === 0) return new Float32Array(0)

  const result = new Float32Array(newLength)

  for (let i = 0; i < newLength; i++) {
    const position = i * ratio
    const index = Math.floor(position)
    const fraction = position - index

    // Linear interpolation between adjacent samples
    const a = buffer[index] ?? 0
    const b = buffer[index + 1] ?? a
    result[i] = a + fraction * (b - a)
  }

  return result
}

/**
 * Convert Float32 audio samples [-1.0, 1.0] to Int16 [-32768, 32767].
 * Clamps out-of-range and non-finite values to prevent overflow.
 */
function floatToInt16(input: Float32Array): Int16Array {
  const output = new Int16Array(input.length)

  for (let i = 0; i < input.length; i++) {
    let sample = input[i]

    // Guard against NaN/Infinity
    if (!Number.isFinite(sample)) {
      output[i] = 0
      continue
    }

    // Clamp to [-1, 1] then scale asymmetrically:
    // negative range [-32768, 0], positive range [0, 32767]
    sample = Math.max(-1, Math.min(1, sample))
    output[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff
  }

  return output
}
