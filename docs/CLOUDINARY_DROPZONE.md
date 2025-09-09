# CloudinaryDropzone Component

A **single, flexible, theme-aware dropzone component** designed as the perfect foundation for developers to build file upload functionality without starting from scratch.

## 🎯 Philosophy

- **One Component**: Single, powerful component instead of multiple confusing options
- **Theme Integration**: Automatically works with any Tailwind theme out of the box
- **Developer Experience**: Sensible defaults with full customization control
- **Framework Ready**: Perfect foundation for building any upload feature

## 🚀 Quick Start

### Basic Manual Upload

```tsx
import { CloudinaryDropzone } from '@/shared/components/upload'

export default function MyUploadPage() {
  const handleUpload = (file) => {
    console.log('File uploaded:', file)
    // Save to database, update state, etc.
  }

  return (
    <CloudinaryDropzone
      cloudName="your-cloud-name"
      uploadPreset="your-preset"
      onUpload={handleUpload}
      showUploadButton={true}
      uploadButtonText="Upload Files"
    />
  )
}
```

### Form Integration

```tsx
const [triggerUpload, setTriggerUpload] = useState(false)

const handleFormSubmit = () => {
  // Trigger upload when form is submitted
  setTriggerUpload(true)
}

return (
  <CloudinaryDropzone
    cloudName="your-cloud-name"
    uploadPreset="your-preset"
    onUpload={handleUpload}
    showUploadButton={false}
    triggerUpload={triggerUpload}
    onUploadTrigger={() => setTriggerUpload(false)}
  />
)
```

## 📋 Props Reference

### Core Configuration

| Prop           | Type                              | Default      | Description                    |
| -------------- | --------------------------------- | ------------ | ------------------------------ |
| `cloudName`    | `string`                          | **required** | Your Cloudinary cloud name     |
| `uploadPreset` | `string`                          | **required** | Cloudinary upload preset       |
| `onUpload`     | `(file: UploadedFile) => void`    | -            | Called for each uploaded file  |
| `onError`      | `(error: string) => void`         | -            | Called on upload errors        |
| `onSuccess`    | `(files: UploadedFile[]) => void` | -            | Called when all files uploaded |

### File Validation

| Prop            | Type       | Default       | Description                   |
| --------------- | ---------- | ------------- | ----------------------------- |
| `maxFileSize`   | `number`   | `10485760`    | Max file size in bytes (10MB) |
| `acceptedTypes` | `string[]` | `['image/*']` | Accepted MIME types           |
| `maxFiles`      | `number`   | `10`          | Maximum number of files       |
| `multiple`      | `boolean`  | `true`        | Allow multiple file selection |

### UI Customization

| Prop                | Type     | Default | Description            |
| ------------------- | -------- | ------- | ---------------------- |
| `className`         | `string` | -       | Root container classes |
| `dropzoneClassName` | `string` | -       | Dropzone area classes  |
| `textClassName`     | `string` | -       | Text content classes   |
| `iconClassName`     | `string` | -       | Icon container classes |

### Content Customization

| Prop          | Type              | Default                      | Description           |
| ------------- | ----------------- | ---------------------------- | --------------------- |
| `placeholder` | `string`          | `'Drag & drop files here'`   | Main text             |
| `subtext`     | `string`          | `'or click to select files'` | Subtitle text         |
| `icon`        | `React.ReactNode` | `'📤'`                       | Custom icon component |

### Behavior

| Prop               | Type      | Default          | Description                                   |
| ------------------ | --------- | ---------------- | --------------------------------------------- |
| `autoUpload`       | `boolean` | `false`          | Upload immediately on drop                    |
| `showProgress`     | `boolean` | `true`           | Show upload progress bars                     |
| `showPreview`      | `boolean` | `true`           | Show file previews (selected & uploaded)      |
| `showUploadButton` | `boolean` | `true`           | Show manual upload button                     |
| `uploadButtonText` | `string`  | `'Upload Files'` | Text for upload button                        |
| `enableRetry`      | `boolean` | `true`           | Enable retry functionality for failed uploads |
| `retryButtonText`  | `string`  | `'Retry'`        | Text for retry button                         |
| `maxRetries`       | `number`  | `3`              | Maximum number of retry attempts              |

### Theme Integration

| Prop      | Type                                             | Default     | Description          |
| --------- | ------------------------------------------------ | ----------- | -------------------- |
| `variant` | `'default' \| 'outline' \| 'ghost' \| 'minimal'` | `'outline'` | Visual style variant |
| `size`    | `'sm' \| 'md' \| 'lg'`                           | `'md'`      | Dropzone size        |

### Advanced

| Prop            | Type      | Default | Description                    |
| --------------- | --------- | ------- | ------------------------------ |
| `disabled`      | `boolean` | `false` | Disable interactions           |
| `loading`       | `boolean` | `false` | Show loading state             |
| `uploadTimeout` | `number`  | `30000` | Upload timeout in milliseconds |

### External Control

| Prop              | Type                      | Default | Description                      |
| ----------------- | ------------------------- | ------- | -------------------------------- |
| `triggerUpload`   | `boolean`                 | `false` | External trigger to start upload |
| `onUploadTrigger` | `() => void`              | -       | Called when upload is triggered  |
| `onFilesChange`   | `(files: File[]) => void` | -       | Called when files are selected   |

## 🎨 Theme Integration

The component automatically uses your Tailwind theme colors:

```tsx
// Automatically uses theme colors
<CloudinaryDropzone
  cloudName="demo"
  uploadPreset="ml_default"
  onUpload={handleUpload}
  // Uses: border-border, bg-background, text-foreground, etc.
/>
```

### Theme Color Mapping

- `border-border` - Dropzone border
- `bg-background` - Dropzone background
- `text-foreground` - Main text color
- `text-muted-foreground` - Secondary text
- `bg-primary` - Progress bars and accents
- `bg-muted` - File preview backgrounds

## 🎭 Variants

### Outline (Default)

```tsx
<CloudinaryDropzone variant="outline" />
```

Broken outline design with subtle hover effects.

### Ghost

```tsx
<CloudinaryDropzone variant="ghost" />
```

Transparent background with muted borders.

### Minimal

```tsx
<CloudinaryDropzone variant="minimal" />
```

No borders, clean minimal design.

### Default

```tsx
<CloudinaryDropzone variant="default" />
```

Card-style with solid background.

## 📏 Sizes

### Small

```tsx
<CloudinaryDropzone size="sm" />
```

Compact 120px height, perfect for forms.

### Medium (Default)

```tsx
<CloudinaryDropzone size="md" />
```

Standard 200px height, good for most use cases.

### Large

```tsx
<CloudinaryDropzone size="lg" />
```

Spacious 300px height, great for dedicated upload pages.

## 🆕 New Features

### ✨ Manual Upload Control

- **No Auto-Upload**: Files are selected first, then uploaded manually
- **Upload Button**: Clear "Upload Files" button with file count
- **Better Control**: Perfect for forms and multi-step processes

### 🖼️ Internal File Preview

- **Selected Files**: Preview files before uploading
- **Remove Individual**: Remove unwanted files easily
- **File Info**: Shows file size and type
- **Image Previews**: Thumbnail previews for images

### 🎯 External Upload Trigger

- **Form Integration**: Trigger uploads from external buttons
- **Multi-Step Forms**: Upload files on final form submission
- **Programmatic Control**: Full control over when uploads happen

### 🎨 Improved UX

- **Better Proportions**: Proper aspect ratios (4:3, 3:2)
- **Smooth Animations**: Subtle, non-bouncy animations
- **Theme Integration**: Perfect theme color integration
- **Responsive Design**: Works great on all screen sizes

### 🛡️ Comprehensive Error Handling

- **Graceful Failures**: No more stuck progress bars
- **Retry Mechanism**: Automatic retry with configurable attempts
- **Timeout Handling**: Prevents infinite loading states
- **User-Friendly Messages**: Clear error descriptions
- **Visual Feedback**: Color-coded progress states
- **Individual File Control**: Retry specific failed uploads

## 💡 Usage Examples

### Basic Manual Upload

```tsx
<CloudinaryDropzone
  cloudName="my-cloud"
  uploadPreset="my-preset"
  onUpload={(file) => console.log('Uploaded:', file)}
  showUploadButton={true}
  uploadButtonText="Upload Images"
/>
```

### Custom Styling

```tsx
<CloudinaryDropzone
  cloudName="my-cloud"
  uploadPreset="my-preset"
  onUpload={handleUpload}
  className="my-custom-container"
  dropzoneClassName="border-2 border-dashed border-blue-500"
  textClassName="text-blue-600 font-bold"
  placeholder="Drop your files here!"
  subtext="Click to browse"
/>
```

### Form Integration

```tsx
<CloudinaryDropzone
  cloudName="my-cloud"
  uploadPreset="my-preset"
  onUpload={handleUpload}
  variant="ghost"
  size="sm"
  maxFiles={1}
  acceptedTypes={['image/jpeg', 'image/png']}
  placeholder="Upload profile picture"
  subtext="JPG or PNG only"
/>
```

### Advanced Configuration

```tsx
<CloudinaryDropzone
  cloudName="my-cloud"
  uploadPreset="my-preset"
  onUpload={handleUpload}
  onError={handleError}
  onSuccess={handleSuccess}
  maxFileSize={5 * 1024 * 1024} // 5MB
  acceptedTypes={['image/*', 'application/pdf']}
  maxFiles={5}
  multiple={true}
  variant="outline"
  size="lg"
  showProgress={true}
  showPreview={true}
  placeholder="Upload documents"
  subtext="Images and PDFs accepted"
  disabled={isSubmitting}
/>
```

## 🔧 Customization Guide

### Custom Icon

```tsx
<CloudinaryDropzone
  cloudName="my-cloud"
  uploadPreset="my-preset"
  onUpload={handleUpload}
  icon={<UploadIcon className="w-8 h-8" />}
/>
```

### Custom Styling with CSS Variables

```tsx
<CloudinaryDropzone
  cloudName="my-cloud"
  uploadPreset="my-preset"
  onUpload={handleUpload}
  dropzoneClassName="border-2 border-dashed border-[hsl(var(--primary))] bg-[hsl(var(--muted))]"
/>
```

### Conditional Rendering

```tsx
{
  isLoggedIn ? (
    <CloudinaryDropzone
      cloudName="my-cloud"
      uploadPreset="my-preset"
      onUpload={handleUpload}
    />
  ) : (
    <div>Please log in to upload files</div>
  )
}
```

## 📊 UploadedFile Interface

```typescript
interface UploadedFile {
  publicId: string // Cloudinary public ID
  url: string // Direct image URL
  name: string // Original filename
  size: number // File size in bytes
  type: string // MIME type
  uploadedAt: Date // Upload timestamp
}
```

## 🎯 Best Practices

### 1. **Use Appropriate Variants**

- `outline` - Most common, good for forms
- `ghost` - Subtle, good for inline uploads
- `minimal` - Clean, good for dashboards
- `default` - Prominent, good for dedicated pages

### 2. **Choose Right Size**

- `sm` - Form fields, compact spaces
- `md` - General purpose, most use cases
- `lg` - Dedicated upload pages, prominent features

### 3. **Handle Errors Gracefully**

```tsx
const handleError = (error: string) => {
  toast.error(`Upload failed: ${error}`)
  // Log to monitoring service
  console.error('Upload error:', error)
}
```

### 4. **Validate Files on Server**

```tsx
const handleUpload = async (file: UploadedFile) => {
  // Save to database
  await saveFileToDatabase(file)

  // Update UI state
  setUploadedFiles((prev) => [...prev, file])
}
```

### 5. **Use Theme Colors**

The component automatically adapts to your theme. No need to hardcode colors!

## 🛡️ Error Handling

### Error States

The component provides comprehensive error handling with visual feedback:

- **🟡 Uploading**: Normal upload in progress
- **🟢 Completed**: Upload successful
- **🔴 Error**: Upload failed with retry option
- **🟠 Retrying**: Retry attempt in progress

### Error Types Handled

1. **Network Errors**: Connection issues, timeouts
2. **Server Errors**: Cloudinary API errors, invalid responses
3. **File Errors**: Invalid files, size limits, type restrictions
4. **Timeout Errors**: Uploads taking too long

### Retry Mechanism

```tsx
<CloudinaryDropzone
  cloudName="my-cloud"
  uploadPreset="my-preset"
  onUpload={handleUpload}
  enableRetry={true}
  maxRetries={3}
  retryButtonText="Try Again"
  uploadTimeout={30000} // 30 seconds
/>
```

### Error Callbacks

```tsx
const handleError = (error: string, file?: File) => {
  console.error('Upload failed:', error)
  if (file) {
    console.error('Failed file:', file.name)
  }
  // Show user-friendly error message
  toast.error(`Upload failed: ${error}`)
}

;<CloudinaryDropzone
  onError={handleError}
  // ... other props
/>
```

### Progress States

The progress display shows different states:

```tsx
// Uploading state
{
  progress.status === 'uploading' && `${progress.progress}%`
}

// Error state with retry button
{
  progress.status === 'error' && (
    <button onClick={() => retryUpload(fileId)}>{retryButtonText}</button>
  )
}

// Completed state
{
  progress.status === 'completed' && 'Complete!'
}
```

## 🚨 Common Issues

### Upload Not Working

- Check `cloudName` and `uploadPreset` are correct
- Verify Cloudinary preset is set to "Unsigned"
- Check browser console for CORS errors
- Verify network connectivity

### Stuck Progress Bars

- **Fixed!** Progress bars now properly handle errors
- Failed uploads show error state with retry option
- Timeouts prevent infinite loading states

### Styling Issues

- Use `dropzoneClassName` for custom dropzone styles
- Use `textClassName` for custom text styles
- Check if theme colors are properly configured

### File Validation

- Set appropriate `maxFileSize` for your needs
- Configure `acceptedTypes` for file type restrictions
- Use `maxFiles` to limit number of files

### Error Handling

- Check `onError` callback is properly implemented
- Verify retry mechanism is enabled (`enableRetry={true}`)
- Adjust `uploadTimeout` for slow connections
- Monitor `maxRetries` setting

## 🔗 Integration Examples

### With Database

```tsx
const handleUpload = async (file: UploadedFile) => {
  const response = await fetch('/api/files', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      publicId: file.publicId,
      url: file.url,
      name: file.name,
      size: file.size,
      type: file.type,
    }),
  })

  if (response.ok) {
    toast.success('File saved successfully!')
  }
}
```

### With State Management

```tsx
const [files, setFiles] = useState<UploadedFile[]>([])

const handleUpload = (file: UploadedFile) => {
  setFiles((prev) => [...prev, file])
}

const handleRemove = (publicId: string) => {
  setFiles((prev) => prev.filter((f) => f.publicId !== publicId))
}
```

### With Form Libraries

```tsx
const { setValue, watch } = useForm()

const uploadedFiles = watch('files') || []

const handleUpload = (file: UploadedFile) => {
  setValue('files', [...uploadedFiles, file])
}
```

### Multi-Step Form Integration

```tsx
const [triggerUpload, setTriggerUpload] = useState(false)
const [selectedFiles, setSelectedFiles] = useState<File[]>([])

const handleFormSubmit = async () => {
  // Trigger upload when form is submitted
  if (selectedFiles.length > 0) {
    setTriggerUpload(true)
    // Wait for upload to complete
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }

  // Submit form with uploaded files
  submitForm()
}

return (
  <CloudinaryDropzone
    cloudName="my-cloud"
    uploadPreset="my-preset"
    onFilesChange={setSelectedFiles}
    onUpload={handleUpload}
    showUploadButton={false}
    triggerUpload={triggerUpload}
    onUploadTrigger={() => setTriggerUpload(false)}
  />
)
```

### External Upload Trigger

```tsx
const [triggerUpload, setTriggerUpload] = useState(false)

const handleExternalUpload = () => {
  setTriggerUpload(true)
  setTimeout(() => setTriggerUpload(false), 100)
}

return (
  <div>
    <button onClick={handleExternalUpload}>
      Upload Files from External Button
    </button>

    <CloudinaryDropzone
      cloudName="my-cloud"
      uploadPreset="my-preset"
      onUpload={handleUpload}
      showUploadButton={false}
      triggerUpload={triggerUpload}
      onUploadTrigger={() => console.log('Upload triggered!')}
    />
  </div>
)
```

## 🎉 That's It!

You now have a powerful, flexible, theme-aware dropzone component that works out of the box with any Tailwind theme. Perfect for building any file upload feature your application needs!
