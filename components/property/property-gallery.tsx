"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Expand } from "lucide-react"

interface PropertyGalleryProps {
  images: string[]
}

export default function PropertyGallery({ images }: PropertyGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [fullscreenIndex, setFullscreenIndex] = useState(0)
  
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex + 1 >= images.length ? 0 : prevIndex + 1
    )
  }
  
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex - 1 < 0 ? images.length - 1 : prevIndex - 1
    )
  }
  
  const nextFullscreenImage = () => {
    setFullscreenIndex((prevIndex) => 
      prevIndex + 1 >= images.length ? 0 : prevIndex + 1
    )
  }
  
  const prevFullscreenImage = () => {
    setFullscreenIndex((prevIndex) => 
      prevIndex - 1 < 0 ? images.length - 1 : prevIndex - 1
    )
  }
  
  const openFullscreen = (index: number) => {
    setFullscreenIndex(index)
    setDialogOpen(true)
  }

  return (
    <div className="relative">
      {/* Main Gallery Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-[400px] md:h-[500px]">
        {/* Main/Featured Image */}
        <div 
          className="md:col-span-2 relative rounded-lg overflow-hidden bg-muted cursor-pointer group"
          onClick={() => openFullscreen(currentImageIndex)}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
            style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Expand className="text-white h-10 w-10" />
          </div>
          
          {/* Navigation Controls for Main Image */}
          <button 
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
            }}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        
        {/* Thumbnails - Only display if there are more than 1 image */}
        {images.length > 1 && (
          <div className="hidden md:flex md:flex-col gap-3 h-full">
            {images.slice(0, 3).map((image, index) => (
              <div 
                key={index}
                className={`relative rounded-lg overflow-hidden ${
                  index === 2 && images.length > 3 ? 'cursor-pointer' : 'cursor-pointer'
                } flex-1 bg-muted group`}
                onClick={() => openFullscreen(index)}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105"
                  style={{ backgroundImage: `url(${image})` }}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Expand className="text-white h-6 w-6" />
                </div>
                
                {/* Show overlay with remaining count if this is the last thumbnail and there are more images */}
                {index === 2 && images.length > 3 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity group-hover:opacity-80">
                    <span className="text-white font-medium text-lg">+{images.length - 3} more</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Fullscreen Gallery Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-5xl p-0 bg-transparent border-none">
          <div className="relative h-[80vh] bg-black/95 rounded-lg overflow-hidden">
            <div 
              className="absolute inset-0 bg-contain bg-no-repeat bg-center"
              style={{ backgroundImage: `url(${images[fullscreenIndex]})` }}
            />
            
            {/* Fullscreen Navigation */}
            <button 
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors"
              onClick={prevFullscreenImage}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button 
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors"
              onClick={nextFullscreenImage}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            
            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white py-1 px-4 rounded-full">
              {fullscreenIndex + 1} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}