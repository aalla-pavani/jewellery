 import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUpload } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { motion } from 'framer-motion';
import { MdCompareArrows } from 'react-icons/md';

const Generate = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setErrorMessage('Please select an image file.');
            return;
        }

        setSelectedFile(file);
        setErrorMessage('');
        setGeneratedImage(null);

        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleProcess = async () => {
        if (!selectedFile) {
            setErrorMessage('Please select an image file.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setErrorMessage('Please log in to generate images.');
            return;
        }

        setIsProcessing(true);
        setErrorMessage('');

        const maxRetries = 3;
        let retryCount = 0;

        while (retryCount < maxRetries) {
            try {
                // Step 1: Generate image using AI model service (port 3000)
                const aiFormData = new FormData();
                aiFormData.append('file', selectedFile);

                console.log('Sending request to AI service...');
                const modelResponse = await axios.post('http://localhost:3000/api/generate', aiFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    responseType: 'blob'
                });
                console.log('Received response from AI service');

                // Step 2: Create a File object from the generated image
                const generatedFile = new File([modelResponse.data], 'generated.png', { type: 'image/png' });
                
                // Step 3: Save both images to backend storage (port 4000)
                const backendFormData = new FormData();
                backendFormData.append('sketch', selectedFile);
                backendFormData.append('generated', generatedFile);

                console.log('Saving images to backend...');
                const backendResponse = await axios.post('http://localhost:4000/api/images/upload', backendFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'x-auth-token': token
                    }
                });
                console.log('Images saved successfully:', backendResponse.data);

                // Create object URLs for preview
                const sketchUrl = URL.createObjectURL(selectedFile);
                const generatedUrl = URL.createObjectURL(generatedFile);
                
                setGeneratedImage({
                    sketch: sketchUrl,
                    generated: generatedUrl
                });
                break; // Success - exit the retry loop

            } catch (error) {
                console.error('Error processing image:', error);
                retryCount++;
                
                if (error.response?.status === 401) {
                    setErrorMessage('Your session has expired. Please log in again.');
                    localStorage.removeItem('token');
                    break;
                }

                // Handle different types of errors
                if (error.message === 'Network Error') {
                    if (error.config?.url?.includes('3000')) {
                        setErrorMessage('AI service is not available. Please try again later.');
                    } else {
                        setErrorMessage('Backend service is not available. Please try again later.');
                    }
                } else if (error.response?.data?.error?.includes('rate limit exceeded')) {
                    setErrorMessage('AI service is busy. Please try again in a few minutes.');
                } else {
                    setErrorMessage('Error processing image. Please try again.');
                }
                
                if (retryCount === maxRetries) {
                    break;
                }
                
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        setIsProcessing(false);
    };

    useEffect(() => {
        return () => {
            if (generatedImage) {
                URL.revokeObjectURL(generatedImage.sketch);
                URL.revokeObjectURL(generatedImage.generated);
            }
        };
    }, [generatedImage]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-7xl mx-auto"
            >
                {/* Header Section */}
                <div className="flex flex-col items-start gap-2 mb-8">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "44px" }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                        className="h-[3px] bg-gradient-to-r from-[#414141] to-[#6b6b6b]"
                    />
                    <motion.p 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                        className="font-medium text-base uppercase tracking-wider text-[#414141]/80"
                    >
                        Transform
                    </motion.p>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                        className="prata-regular text-4xl md:text-5xl lg:text-6xl text-[#414141]"
                    >
                        Your Sketches
                    </motion.h1>
                </div>

                {/* Error Message */}
                {errorMessage && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm"
                    >
                        <p className="text-red-700">{errorMessage}</p>
                    </motion.div>
                )}

                {/* Main Content */}
                <div className="flex flex-col space-y-8">
                    {/* Image Display Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                        className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100"
                    >
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            {/* Original Image */}
                            <div className="flex-1 w-full">
                                <h3 className="text-lg font-medium text-gray-700 mb-4">Original Sketch</h3>
                                <div className="relative aspect-square w-full bg-gray-50 rounded-lg overflow-hidden border-2 border-dashed border-gray-200">
                                    {preview ? (
                                        <div className="relative w-full h-full">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="w-full h-full object-contain"
                                            />
                                            <button
                                                onClick={() => {
                                                    setPreview(null);
                                                    setSelectedFile(null);
                                                }}
                                                className="absolute top-2 right-2 bg-red-500/90 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-300 shadow-lg"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                                            <FiUpload className="w-12 h-12 text-gray-400 mb-3" />
                                            <p className="text-gray-500 text-center">Click or drag to upload your sketch</p>
                                            <p className="text-sm text-gray-400 mt-2">Supported formats: PNG, JPG, JPEG</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        disabled={isProcessing}
                                    />
                                </div>
                            </div>

                            {/* Arrow Icon */}
                            <div className="flex items-center justify-center">
                                <MdCompareArrows className="w-8 h-8 text-gray-400 rotate-90 md:rotate-0" />
                            </div>

                            {/* Generated Image */}
                            <div className="flex-1 w-full">
                                <h3 className="text-lg font-medium text-gray-700 mb-4">Generated Result</h3>
                                <div className="relative aspect-square w-full bg-gray-50 rounded-lg overflow-hidden border-2 border-dashed border-gray-200">
                                    {generatedImage ? (
                                        <img
                                            src={generatedImage.generated}
                                            alt="Generated"
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                                            <p className="text-gray-400 text-center">Generated image will appear here</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Generate Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                        className="flex justify-center"
                    >
                        <button
                            onClick={handleProcess}
                            disabled={!selectedFile || isProcessing}
                            className={`px-8 py-4 rounded-xl text-white font-medium shadow-sm ${
                                !selectedFile || isProcessing
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-[#414141] to-[#6b6b6b] hover:from-[#313131] hover:to-[#515151] transform hover:-translate-y-0.5'
                            } transition-all duration-300 max-w-md w-full`}
                        >
                            {isProcessing ? (
                                <div className="flex items-center justify-center">
                                    <AiOutlineLoading3Quarters className="animate-spin mr-3" />
                                    Processing...
                                </div>
                            ) : (
                                'Generate Image'
                            )}
                        </button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Generate;