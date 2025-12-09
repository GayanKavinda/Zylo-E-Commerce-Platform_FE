'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Trash2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount_price: '',
    stock: '',
    category: '',
    sku: '',
    images: [''],
    is_active: true,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Fetch product
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data } = await api.get(`/seller/products/${productId}`);
      return data;
    },
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        discount_price: product.discount_price?.toString() || '',
        stock: product.stock?.toString() || '',
        category: product.category || '',
        sku: product.sku || '',
        images: product.images && product.images.length > 0 ? product.images : [''],
        is_active: product.is_active ?? true,
      });
    }
  }, [product]);

  const updateProduct = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put(`/seller/products/${productId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['seller-products'] });
      alert('Product updated successfully!');
      router.push('/seller/products');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to update product');
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async () => {
      await api.delete(`/seller/products/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-products'] });
      alert('Product deleted successfully!');
      router.push('/seller/products');
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

    updateProduct.mutate(data);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      deleteProduct.mutate();
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

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

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-heading-1">Edit Product</h1>
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={deleteProduct.isPending}
            className="text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Product
          </Button>
        </div>

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
                  />
                </div>

                <div>
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded"
                  />
                  <span>Active (visible to customers)</span>
                </Label>
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
                <Label htmlFor="file-upload">Upload New Images from Computer</Label>
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
                  <span className="bg-white px-2 text-muted-foreground">Current & URL Images</span>
                </div>
              </div>

              {/* Current Images */}
              {formData.images.map((image, index) => (
                <div key={index}>
                  <Label htmlFor={`image-${index}`}>Image URL {index + 1}</Label>
                  <Input
                    id={`image-${index}`}
                    value={image}
                    onChange={(e) => {
                      const newImages = [...formData.images];
                      newImages[index] = e.target.value;
                      setFormData({ ...formData, images: newImages });
                    }}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormData({ ...formData, images: [...formData.images, ''] })}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Add Another Image URL
              </Button>
              <p className="text-sm text-gray-500">
                💡 Tip: You can upload new images from your computer or modify existing URLs
              </p>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={updateProduct.isPending || uploadingImages}
              className="btn-primary flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {uploadingImages ? 'Uploading Images...' : updateProduct.isPending ? 'Saving...' : 'Save Changes'}
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
