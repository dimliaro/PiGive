import { useRef, useState } from 'react'
import { uploadImage, cloudinaryConfigured } from '../utils/uploadImage'

export default function ImageUploader({ value, onChange }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const canUpload = cloudinaryConfigured()

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { setError('Image must be under 10MB.'); return }
    setError('')
    setUploading(true)
    try {
      const url = await uploadImage(file)
      onChange(url)
    } catch {
      setError('Upload failed. Try pasting a URL instead.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">
        Campaign Image <span className="text-gray-600">(optional)</span>
      </label>

      {canUpload && (
        <>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-full flex items-center justify-center gap-2 bg-white/[0.04] border border-white/[0.1] border-dashed rounded-xl px-4 py-4 text-gray-400 hover:text-white hover:border-white/25 transition-colors text-sm disabled:opacity-50 mb-2"
          >
            {uploading ? (
              <>
                <span className="animate-spin">⏳</span> Uploading...
              </>
            ) : (
              <>
                📷 Take a photo or choose from gallery
              </>
            )}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFile}
          />
          <p className="text-xs text-gray-600 text-center mb-2">— or paste a URL —</p>
        </>
      )}

      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="https://... paste an image link"
        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 text-sm"
      />

      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}

      {value && (
        <div className="mt-2 relative group">
          <img
            src={value}
            alt="preview"
            className="w-full h-36 object-cover rounded-xl opacity-80"
            onError={e => e.target.style.display = 'none'}
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ✕ Remove
          </button>
        </div>
      )}
    </div>
  )
}
