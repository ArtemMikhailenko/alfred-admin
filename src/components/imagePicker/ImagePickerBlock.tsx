import { useRef, useState } from 'react'
import { CSSProperties } from 'react'
import colors from '../../constants/colors'
import globalStyles from '../../constants/globalStyles'
import { styles } from './styles'
const url: string = process.env.REACT_APP_SERVER_URL || ''
const domen = url.split('//')[1].split('.')[0]

export default function ImagePickerBlock({
  banner,
  setBanner,
  avatar,
  setAvatar,
  showImageBannerInputs,
  setShowImageBannerInputs,
  showImageAvatarInputs,
  setShowImageAvatarInputs,
}: {
  banner: string | File | null
  setBanner: (i: string | File | null) => void
  avatar: string | File | null
  setAvatar: (i: string | File | null) => void
  showImageBannerInputs: boolean
  setShowImageBannerInputs: (i: boolean) => void
  showImageAvatarInputs: boolean
  setShowImageAvatarInputs: (i: boolean) => void
}) {
  const [editBannerFile, setEditBannerFile] = useState<File | null>(null)
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null)

  const bannerFileInput = useRef<HTMLInputElement>(null)
  const avatarFileInput = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setEditBannerFile(file)
      // setPreviewURL(URL.createObjectURL(file))
    } else {
      alert('Only .jpeg, .jpg, .png files are allowed')
    }
  }

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && ['image/svg+xml'].includes(file.type)) {
      setEditAvatarFile(file)
    } else {
      alert('Only .svg files are allowed')
    }
  }

  return (
    <>
      {/* BANNER */}
      <div style={styles.row}>
        <button
          style={styles.button}
          onClick={() => {
            if (showImageBannerInputs) {
              setBanner(editBannerFile || null)
              setEditBannerFile(null)
            }

            setShowImageBannerInputs(!showImageBannerInputs)
          }}
        >
          {showImageBannerInputs
            ? 'Save'
            : banner
            ? 'Edit Banner'
            : 'Add Banner'}
        </button>
        {showImageBannerInputs ? (
          <>
            <input
              ref={bannerFileInput}
              style={{ display: 'none' }}
              type="file"
              accept=".jpeg,.jpg,.png"
              onChange={handleFileChange}
            />
            <button
              style={styles.input}
              onClick={() => bannerFileInput.current?.click()}
            >
              {editBannerFile !== null ? editBannerFile.name : 'Choose file'}
            </button>
            <button
              style={{ ...styles.button, backgroundColor: colors.red }}
              onClick={() => {
                setEditBannerFile(null)
                setShowImageBannerInputs(!showImageBannerInputs)
              }}
            >
              Cancel
            </button>
          </>
        ) : banner ? (
          <img
            src={
              typeof banner === 'string' ? banner : URL.createObjectURL(banner)
            }
            alt="Preview"
            style={styles.imagePreview}
          />
        ) : (
          <p style={globalStyles.comment}>required</p>
        )}
      </div>
      {/* AVATAR */}
      <div style={styles.row}>
        <button
          style={styles.button}
          onClick={() => {
            if (showImageAvatarInputs) {
              setAvatar(editAvatarFile || null)
              setEditAvatarFile(null)
            }

            setShowImageAvatarInputs(!showImageAvatarInputs)
          }}
        >
          {showImageAvatarInputs
            ? 'Save'
            : avatar
            ? 'Edit Avatar'
            : 'Add Avatar'}
        </button>
        {showImageAvatarInputs ? (
          <>
            <input
              ref={avatarFileInput}
              style={{ display: 'none' }}
              type="file"
              accept=".svg"
              onChange={handleAvatarFileChange}
            />
            <button
              style={styles.input}
              onClick={() => avatarFileInput.current?.click()}
            >
              {editAvatarFile !== null ? editAvatarFile.name : 'Choose file'}
            </button>
            <button
              style={{ ...styles.button, backgroundColor: colors.red }}
              onClick={() => {
                setEditAvatarFile(null)
                setShowImageAvatarInputs(!showImageAvatarInputs)
              }}
            >
              Cancel
            </button>
          </>
        ) : avatar ? (
          <img
            src={
              typeof avatar === 'string' ? avatar : URL.createObjectURL(avatar)
            }
            alt="Preview"
            style={styles.imagePreview}
          />
        ) : (
          <p style={globalStyles.comment}>required</p>
        )}
      </div>
    </>
  )
}
