import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setServicesAction,useServices } from "Slices/MainSlice"; // Adjust this import to your actual file structure
import Header from 'components/Header';
import ModalWindow from 'components/ModalWindow';
import styles from './EditServicePage.module.scss';
import Button from 'react-bootstrap/Button';
export type ServiceData = {
  id: number;
  title: string;
  info: string;
  src: string;
  loc: string;
  sup: string;
  status: string;
};

const EditServicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isImageModalWindowOpened, setIsImageModalWindowOpened] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string>('');

  const services = useServices()
  const [title, setTitle] = useState('');
  const [info, setInfo] = useState('');
  const [loc, setLoc] = useState('');
  const [sup, setSup] = useState('');

  
  useEffect(() => {
    const serviceToEdit = services.find(service => service.id.toString() === id);
    if (serviceToEdit) {
      setTitle(serviceToEdit.title);
      setInfo(serviceToEdit.info);
      setLoc(serviceToEdit.loc);
      setSup(serviceToEdit.sup);
    }
  }, [id, services]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedImage(file);
  };
  const handleUpload = async (id: number) => {
    if (selectedImage) {
      try {
        const formData = new FormData();
        formData.append('file', selectedImage);

        const response = await axios.post(
          `http://localhost:8000/api/services/${id}/image/`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
          }
        );
        const updatedServices = services.map(service => {
          if (service.id === id) {
            return {
              ...service,
              src: response.data
            };
          }
          return service;
        });
        dispatch(setServicesAction(updatedServices))
        console.log(updatedServices)
        setSelectedImage(null)

      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setIsImageModalWindowOpened(false)
      }
    }
  };
  const putService = async (id: number) => {
    try {
      const response = await axios(`http://localhost:8000/api/services/${id}/put/`, {
        method: 'PUT',
        data: {
          service_name: title,
          description: info,
          location_service: loc,
          support_hours: sup,
          status: "operating"
        },
        withCredentials: true
      });
      navigate('/admin');
      const updatedServices = services.map(service => {
        if (service.id === id) {
          return {
            ...service,
            title: response.data.service_name,
            info: response.data.description,
            src: response.data.image,
            loc: response.data.location_service,
            sup: response.data.support_hours
          };
        }
        return service;
      });

      dispatch(setServicesAction(updatedServices));
    } catch (e) {
      console.error(e);
    }
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await putService(parseInt(id ?? ''));
  };
  return (
    <div className={styles.container}>
      <Header/>
      <div className={styles.formContainer}>
        <h1>Редактирование</h1>
        <form onSubmit={handleFormSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Название услуги:</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.inputField}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="info">Описание:</label>
            <textarea
              id="info"
              value={info}
              onChange={(e) => setInfo(e.target.value)}
              className={styles.textAreaField}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="loc">Место оказания услуги:</label>
            <input
              id="loc"
              type="text"
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
              className={styles.inputField}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="sup">Часы поддержки:</label>
            <input
              id="sup"
              type="text"
              value={sup}
              onChange={(e) => setSup(e.target.value)}
              className={styles.inputField}
            />
          </div>
          <button type="button" onClick={() => setIsImageModalWindowOpened(true)} className={styles.submitButton}>
          Редактировать картинку
        </button>
          <button type="submit" className={styles.submitButton}>Сохранить изменения</button>
        </form>
      </div>
      <ModalWindow 
      handleBackdropClick={() => { setIsImageModalWindowOpened(false); setSelectedImage(null); }}
      active={isImageModalWindowOpened}
      className={styles.modal}
    >
      <h3 className={styles.modal__title}>Выберите картинку</h3>
      {currentImage && <h4 className={styles.modal__subtitle}>Текущее изображение</h4>}
      <div className={styles.dropzone__container}>
        <div className="dropzone__wrapper">
          {currentImage && 
            <img className={styles.dropzone__image} src={currentImage} alt="Текущее изображение" />}
          {selectedImage && 
            <p className={styles.dropzone__filename}>Вы загрузили: <b>{selectedImage.name}</b></p>}
          <label className={styles.dropzone__btn} htmlFor="upload">
            <span className={styles['dropzone__btn-text']}>Загрузите изображение</span>
          </label>
          <input 
            className={styles.drop_button} 
            id="upload" 
            type="file" 
            onChange={handleImageChange} 
          />
        </div>
      </div>
      <Button 
          disabled={!selectedImage} 
          className={styles.drop_button} 
          onClick={() => handleUpload(parseInt(id ?? ''))}
        >
        Сохранить
      </Button>
    </ModalWindow>
  </div>
  );
};
export default EditServicePage;