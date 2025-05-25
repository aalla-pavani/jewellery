import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Title from '../components/Title';
import axios from 'axios';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { IoMdClose } from 'react-icons/io';

const ImageModal = ({ sketchImage, generatedImage, onClose }) => {
  if (!sketchImage || !generatedImage) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 text-3xl transition-colors"
          aria-label="Close modal"
        >
          <IoMdClose />
        </button>
        <div className="relative w-full aspect-[2/1] bg-white rounded-lg shadow-2xl overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-2">
            <img
              src={sketchImage}
              alt="Sketch"
              className="w-full h-full object-cover"
              onClick={(e) => e.stopPropagation()}
            />
            <img
              src={generatedImage}
              alt="Generated"
              className="w-full h-full object-cover"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const UserImages = () => {
  const [imageHistory, setImageHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState(null);

  useEffect(() => {
    const fetchImageHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found, redirecting to login');
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:4000/api/images/history', {
          headers: {
            'x-auth-token': token
          }
        });

        // Validate image data
        const validImages = response.data.filter(item => {
          const isValid = item.sketchImage && item.generatedImage &&
            (item.sketchImage.startsWith('data:image/') || item.sketchImage.startsWith('data:application/')) &&
            (item.generatedImage.startsWith('data:image/') || item.generatedImage.startsWith('data:application/'));
          
          if (!isValid) {
            console.warn('Invalid image data found:', {
              id: item._id,
              hasSketch: !!item.sketchImage,
              hasGenerated: !!item.generatedImage,
              sketchPrefix: item.sketchImage?.substring(0, 30),
              generatedPrefix: item.generatedImage?.substring(0, 30)
            });
          }
          return isValid;
        });

        setImageHistory(validImages);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching images:', err);
        
        // Handle unauthorized error
        if (err.response && err.response.status === 401) {
          console.log('Token expired or invalid, redirecting to login');
          localStorage.removeItem('token'); // Clear invalid token
          navigate('/login');
          return;
        }
        
        setError('Failed to fetch image history. Please try logging in again.');
        setLoading(false);
      }
    };

    fetchImageHistory();
  }, [navigate]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.delete(`http://localhost:4000/api/images/${id}`, {
        headers: {
          'x-auth-token': token
        }
      });
      setImageHistory(prevHistory => prevHistory.filter(item => item._id !== id));
    } catch (err) {
      console.error('Error deleting image:', err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      setError('Failed to delete image. Please try again.');
    }
  };

  const handleImageClick = (item) => {
    setSelectedImages({
      sketchImage: item.sketchImage,
      generatedImage: item.generatedImage
    });
  };

  const renderImage = (dataUrl, alt, item) => {
    if (!dataUrl || !dataUrl.startsWith('data:')) {
      console.error(`Invalid image data for ${alt}:`, dataUrl?.substring(0, 50));
      return null;
    }

    return (
      <img
        src={dataUrl}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover rounded cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg"
        loading="lazy"
        onClick={() => handleImageClick(item)}
        onError={(e) => {
          console.error(`Error loading ${alt} image. Data type:`, dataUrl.split(';')[0]);
          e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
        }}
      />
    );
  };

  if (loading) return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
      <AiOutlineLoading3Quarters className="animate-spin text-4xl text-[#414141]" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#fafafa] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-100 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-[#fafafa] p-8">
        <div className="max-w-6xl mx-auto">
          <Title text1={"MY"} text2={"DESIGNS"} />
          
          {imageHistory.length === 0 ? (
            <p className="text-center mt-8">No designs created yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {imageHistory.map((item) => (
                <div key={item._id} className="bg-white rounded-lg shadow-md p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Sketch</h3>
                      <div className="relative aspect-square">
                        {renderImage(item.sketchImage, 'Sketch', item)}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Generated</h3>
                      <div className="relative aspect-square">
                        {renderImage(item.generatedImage, 'Generated', item)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImages && (
        <ImageModal
          sketchImage={selectedImages.sketchImage}
          generatedImage={selectedImages.generatedImage}
          onClose={() => setSelectedImages(null)}
        />
      )}
    </>
  );
};

export default UserImages;
