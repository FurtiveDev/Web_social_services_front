import React, { useState, ChangeEvent } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios';
// import cn from 'classnames';
import styles from './CustomTable.module.scss'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import AddButton from 'components/Icons/AddButton';
import EditIcon from 'components/Icons/EditIcon';
import BasketIcon from 'components/Icons/BasketIcon';
import ModalWindow from 'components/ModalWindow';
import Form from 'react-bootstrap/Form';
import {useTitleValue, useServices,setTitleValueAction, setServicesAction} from "../../Slices/MainSlice";
import { useDispatch } from 'react-redux';
import ImageIcon from 'components/Icons/ImageIcon';
import { useNavigate } from 'react-router-dom';

export type ReceivedServiceData = {
  id_service: number,
  service_name: string,
  description: string,
  status: string,
  image: string,
  support_hours: string,
  location_service: string,
}


type ColumnData = {
  key: string;
  title: string;
}

export type TableData = {
  columns: ColumnData[];
  data: any[];
  children?: React.ReactNode;
  flag: 0 | 1 | 2 | 3;
  className?: string;
  // handleUsersButtonCLick?: (event: EventData) => void;
  // handleChangeButtonClick?: (event: EventData) => void;
  // handleDeleteButtonClick?: () => void;
};

export type ServiceData =  {
  id: number;
  title: string;
  info: string;
  src: string;
  loc: string;
  sup: string;
  status: string;
};

const CustomTable: React.FC<TableData> = ({columns, data, className}) => {
  const navigate = useNavigate()
  const subscriptions = useServices()
  const dispatch = useDispatch()

  const [isAddModalWindowOpened, setIsAddModalWindowOpened] = useState(false)
  const [isDeleteModalWindowOpened, setIsDeleteModalWindowOpened] = useState(false)
  const [isImageModalWindowOpened, setIsImageModalWindowOpened] = useState(false)

  const [subscriptionTitleValue, setServiceTitleValue] = useState('')
  const [subscriptionInfoValue, setServiceInfoValue] = useState('')
  const [currentServiceId, setCurrentServiceId] = useState<number>()
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState('')
  const [supportHoursValue, setSupportHoursValue] = useState('');
  const [locationServiceValue, setLocationServiceValue] = useState('');

  
  const deleteService = async () => {
    try {
      await axios(`http://localhost:8000/api/services/${currentServiceId}/delete/`, {
        method: 'DELETE',
        withCredentials: true,

      })

      dispatch(setServicesAction(subscriptions.filter((subscription) => {
        return subscription.id !== currentServiceId 
      })))
      setIsDeleteModalWindowOpened(false)
    } catch(e) {
      throw e
    }
  }

  const handleUpload = async () => {
    if (selectedImage) {
      try {
        const formData = new FormData();
        formData.append('file', selectedImage);

        const response = await axios.post(
          `http://localhost:8000/api/services/${currentServiceId}/image/`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
          }
        );
        const updatedServices = subscriptions.map(subscription => {
          if (subscription.id === currentServiceId) {
            return {
              ...subscription,
              src: response.data
            };
          }
          return subscription;
        });
        dispatch(setServicesAction(updatedServices))
        console.log(updatedServices)
        setSelectedImage(null)
        toast.success('Изображение успешно загружено')

      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setIsImageModalWindowOpened(false)
      }
    }
  };

  const handleAddButtonClick = () => {
    navigate('/admin/add')
  }
  const handleEditButtonClick = (subscription: ServiceData) => {
    setCurrentServiceId(subscription.id)
    setServiceTitleValue(subscription.title)
    setServiceInfoValue(subscription.info)
    setLocationServiceValue(subscription.loc)
    setSupportHoursValue(subscription.sup)
    navigate(`/admin/edit/${subscription.id}`)
  }

  const handleDeleteButtonClick = (id: number) => {
    setCurrentServiceId(id)
    setIsDeleteModalWindowOpened(true)
  }

  const handleImageButtonClick = (subscription: ServiceData) => {
    setCurrentServiceId(subscription.id)
    setIsImageModalWindowOpened(true)
    setCurrentImage(subscription.src)
  }



  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  return (
    <>
    <span className={`${styles['table__add-text']}`}>Добавление новой услуги</span><AddButton onClick={() => handleAddButtonClick()}/>
      <div className={`${styles.table__container} ${className}`}>
      <div className={`${styles.table__add} ${className}`}>
      </div>
      <Table>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column.title}</th>
              ))}
              {<th>Действия</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, columnIndex) => (
                  <td key={columnIndex}>{row[column.key]}</td>
                ))}
                <td className={styles.table__action}>
                  <EditIcon onClick={() => handleEditButtonClick(row)}/>
                  <ImageIcon onClick={() => handleImageButtonClick(row)}/>
                  <BasketIcon onClick={() => handleDeleteButtonClick(row.id)}/>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <ModalWindow handleBackdropClick={() => setIsDeleteModalWindowOpened(false)} active={isDeleteModalWindowOpened} className={styles.modal}>
          <h3 className={styles.modal__title}>Вы уверены, что хотите удалить данную усулугу?</h3>
          <div className={styles['modal__delete-btns']}>
            <Button onClick={() => {deleteService()}} className={styles.modal__btn}>Подтвердить</Button>
            <Button onClick={() => setIsDeleteModalWindowOpened(false)} className={styles.modal__btn}>Закрыть</Button>
          </div>
        </ModalWindow>


        <ModalWindow handleBackdropClick={() => {setIsImageModalWindowOpened(false); setSelectedImage(null)}} active={isImageModalWindowOpened } className={styles.modal}>
          <h3 className={styles.modal__title}>Выберите картинку</h3>
          {currentImage && <h4 className={styles.modal__subtitle}>Текущее изображение</h4>}
          <div className={styles.dropzone__container}>
          <div className="dropzone__wrapper">
          <img className={styles.dropzone__image} src={currentImage} alt="" />
          {selectedImage && <p className={styles.dropzone__filename}>Вы загрузили: <b>{selectedImage.name}</b></p>}
            <label className={styles.dropzone__btn} htmlFor="upload">
              <span className={styles['dropzone__btn-text']}>Загрузите изображение</span>
            </label>
            <input className={styles.dropzone__input} id="upload" type="file" onChange={handleImageChange} />
          </div>
          </div>
          <Button disabled={selectedImage ? false : true} className={styles.dropzone__button} onClick={handleUpload}>Сохранить</Button>
          
        </ModalWindow>
      </div>
    </>
  );
}

export default CustomTable