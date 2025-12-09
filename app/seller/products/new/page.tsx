'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Upload, X, Image as ImageIcon } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';

export default function NewProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount_price: '',
    stock: '',
    category: '',
    sku: '',
    images: [''],
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const createProduct = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/seller/products', data);
      return response.data;
    },
    onSuccess: () => {
      alert('Product created successfully!');
      router.push('/seller/products');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to create product');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let uploadedImageUrls: string[] = [];

    // Upload images if any files are selected
    if (imageFiles.length > 0) {
      setUploadingImages(true);
      try {
        const formDataUpload = new FormData();
        imageFiles.forEach((file) => {
          formDataUpload.append('images[]', file);
        });

        const uploadResponse = await api.post('/seller/products/upload-images', formDataUpload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        uploadedImageUrls = uploadResponse.data.images;
      } catch (error: any) {
        alert(error.response?.data?.message || 'Failed to upload images');
        setUploadingImages(false);
        return;
      }
      setUploadingImages(false);
    }

    // Combine uploaded images with URL images
    const allImages = [
      ...uploadedImageUrls,
      ...formData.images.filter(img => img.trim() !== '')
    ];
    
    const data = {
      ...formData,
      price: parseFloat(formData.price),
      discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
      stock: parseInt(formData.stock),
      images: allImages,
    };

    createProduct.mutate(data);
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles([...imageFiles, ...files]);
    }
  };

  const removeImageFile = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <h1 className="text-heading-1 mb-8">Add New Product</h1>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g., Wireless Headphones"
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  placeholder="Describe your product..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    placeholder="e.g., Electronics"
                  />
                </div>

                <div>
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    required
                    placeholder="e.g., PROD-001"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    placeholder="99.99"
                  />
                </div>

                <div>
                  <Label htmlFor="discount_price">Discount Price ($)</Label>
                  <Input
                    id="discount_price"
                    type="number"
                    step="0.01"
                    value={formData.discount_price}
                    onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                    placeholder="79.99"
                  />
                </div>

                <div>
                  <Label htmlFor="stock">Stock *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                    placeholder="100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Upload Section */}
              <div>
                <Label htmlFor="file-upload">Upload Images from Computer</Label>
                <div className="mt-2 flex items-center gap-4">
                  <Input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                </div>
                {imageFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-medium">Selected Files ({imageFiles.length}):</p>
                    <div className="grid grid-cols-2 gap-2">
                      {imageFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <ImageIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm truncate">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImageFile(index)}
                            className="text-red-500 hover:text-red-700 flex-shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">Or use image URLs</span>
                </div>
              </div>

              {/* URL Input Section */}
              {formData.images.map((image, index) => (
                <div key={index}>
                  <Label htmlFor={`image-${index}`}>Image URL {index + 1}</Label>
                  <Input
                    id={`image-${index}`}
                    value={image}
                    onChange={(e) => updateImage(index, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addImageField}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Add Another Image URL
              </Button>
              <p className="text-sm text-gray-500">
                💡 Tip: You can upload images from your computer or use URLs from Unsplash, Pexels, or your own CDN
              </p>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={createProduct.isPending || uploadingImages}
              className="btn-primary flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {uploadingImages ? 'Uploading Images...' : createProduct.isPending ? 'Creating...' : 'Create Product'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
