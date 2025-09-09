import { CloudinaryDropzone, UploadedFile } from '@/shared/components/upload'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

export const Route = createFileRoute('/upload')({
  component: UploadPage,
})

function UploadPage() {
  const [isClient, setIsClient] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleUpload = (file: UploadedFile) => {
    setUploadedFiles((prev) => [...prev, file])
    toast.success(`Successfully uploaded ${file.name}`)
    console.log('File uploaded:', file)
  }

  const handleError = (error: string, file?: File) => {
    const fileName = file ? file.name : 'Unknown file'
    toast.error(`Upload failed for ${fileName}: ${error}`)
  }

  const handleSuccess = (files: UploadedFile[]) => {
    toast.success(`Successfully uploaded ${files.length} file(s)`)
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            File Upload Center
          </h1>
          <p className="text-lg text-gray-600">
            Drag and drop your files or click to browse
          </p>
        </div>

        {isClient ? (
          <div className="space-y-8">
            {/* Clean Dropzone - No White Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {/* Header with Clear Button */}
              {uploadedFiles.length > 0 && (
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    Uploaded Files ({uploadedFiles.length})
                  </h2>
                  <button
                    onClick={() => setUploadedFiles([])}
                    className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              )}

              <CloudinaryDropzone
                cloudName="deoutrwoa"
                uploadPreset="ml_default"
                onUpload={handleUpload}
                onError={handleError}
                onSuccess={handleSuccess}
                onFilesChange={(files) => console.log('Files selected:', files)}
                maxFileSize={10 * 1024 * 1024}
                acceptedTypes={['image/*']}
                maxFiles={10}
                multiple={true}
                variant="outline"
                size="lg"
                showProgress={true}
                showPreview={true}
                showUploadButton={true}
                uploadButtonText="Upload Images"
                enableRetry={true}
                retryButtonText="Retry Upload"
                maxRetries={3}
                uploadTimeout={30000}
                placeholder="Drag & drop your images here"
                subtext="or click to browse files"
                className="min-h-[320px]"
              />
            </motion.div>

            {/* File Preview Grid */}
            {uploadedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {uploadedFiles.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Files Uploaded
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {Math.round(
                        uploadedFiles.reduce(
                          (acc, file) => acc + file.size,
                          0,
                        ) /
                          1024 /
                          1024,
                      )}
                      MB
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Size
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {
                        uploadedFiles.filter((file) =>
                          file.type.startsWith('image/'),
                        ).length
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">Images</div>
                  </div>
                </div>

                {/* File Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {uploadedFiles.map((file, index) => (
                    <motion.div
                      key={file.publicId}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="group relative"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden bg-muted border border-border/50">
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <div className="mt-2 space-y-1">
                        <p
                          className="text-xs text-foreground truncate font-medium"
                          title={file.name}
                        >
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {file.publicId}
                        </p>
                      </div>
                      {/* Remove button */}
                      <button
                        onClick={() =>
                          setUploadedFiles((prev) =>
                            prev.filter((f) => f.publicId !== file.publicId),
                          )
                        }
                        className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-destructive/90"
                      >
                        ×
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
