import React from 'react';
import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';


const CreateForm = ({heading, label1, label2, label3, label4, onSubmit}) => {

    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);

    const handleSubmit = () => {
        onSubmit(name, desc, price, image);
    }

  return (
    <>
    <h1>{heading}</h1>
    
    <div className="card flex flex-column justify-content-center">
        <div className="flex align-items-center justify-content-center h-3rem bg-primary font-bold border-round m-2"> 
            <label>{label1}</label>
            <InputText value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <br/>
        <div className="flex align-items-center justify-content-center h-3rem bg-primary font-bold border-round m-2"> 
            <label>{label2}</label>
            <InputText value={desc} onChange={(e) => setDesc(e.target.value)} />
        </div>
        <br/>
        <div className="flex align-items-center justify-content-center h-3rem bg-primary font-bold border-round m-2"> 
            <label>{label3}</label>
            <InputText value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <br/>
        <div className="flex align-items-center justify-content-center h-3rem bg-primary font-bold border-round m-2">
            <label>{label4}</label>
            <FileUpload
                mode="basic"
                name="image"
                accept="image/png,image/jpeg,image/jpg"
                maxFileSize={5000000} // 5 MB
                customUpload
                auto={false}
                chooseLabel="Select Image"
                onSelect={(e) => setImage(e.files[0])}
            />
        </div>
        <br/>
        <button className="p-button p-component p-button-success mt-4" onClick={handleSubmit}>Submit</button>
    </div>
    </>
  )
}

export default CreateForm;