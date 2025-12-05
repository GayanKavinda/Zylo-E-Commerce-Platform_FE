'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

interface Review {
  id: number;
  user: {
    name: string;
  };
  rating: number;
  comment: string;
  created_at: string;
  helpful_count: number;
}

interface ReviewListProps {
  productId: number;
}

export default function ReviewList({ productId }: ReviewListProps) {
  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const { data } = await api.get(`/products/${productId}/reviews`);
      return data.data || [];
    },
  });

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading reviews...</p>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-600">Be the first to review this product!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">
        Customer Reviews ({reviews.length})
      </h3>
      
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{review.user.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              {/* Rating Badge */}
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
                {review.rating}
              </Badge>
            </div>

            {/* Star Rating */}
            <div className="flex items-center mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= review.rating
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Review Text */}
            <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

            {/* Helpful Button */}
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                <ThumbsUp className="h-4 w-4" />
                <span>Helpful {review.helpful_count > 0 && `(${review.helpful_count})`}</span>
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
