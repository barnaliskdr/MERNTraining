import React from 'react';
import CreateForm from '../components/CreateForm';

const CreateProduct = () => {
  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

    // const [name, setName] = useState('');
    // const [desc, setDesc] = useState('');
    // const [price, setPrice] = useState('');
    // const [image, setImage] = useState(null);

  return (
    <>
       <CreateForm 
            heading="Create Product"
            label1="Product Name:"
            label2="Description:"
            label3="Price:"
            label4="Image:"
            onSubmit={async (name, desc, price, image) => {
                try {
                    let base64Image = '';
                    if (image instanceof File) {
                        base64Image = await toBase64(image);
                        console.log('Base64 Image:', base64Image);
                    } else if (typeof image === 'string' && image) {
                        base64Image = image;
                        console.log('Base64 Image from string:', base64Image);
                    }

                    const payload = {
                        name,
                        description: desc,
                        price: Number(price),
                        category: 'General',
                        stock: 1,
                        rating: 0,
                        image: base64Image,
                    };

                    const response = await fetch('http://localhost:5000/api/products/addproduct', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload),
                    });

                    const result = await response.json();
                    console.log('Response from server:', result);

                    if (!response.ok) {
                        throw new Error(result.error || 'Failed to create product');
                    }

                    console.log('Product created successfully:', result);
                    alert('Product created successfully');
                } catch (error) {
                    console.error('Error creating product:', error);
                    alert(error.message || 'Something went wrong');
                }
            }}
        />
    </>
  )
}

export default CreateProduct;
