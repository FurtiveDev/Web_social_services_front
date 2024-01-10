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
import {useTitleValue, useSubscriptions,setTitleValueAction, setSubscriptionsAction} from "../../Slices/MainSlice";
import { useDispatch } from 'react-redux';
import ImageIcon from 'components/Icons/ImageIcon';

export type ReceivedSubscriptionData = {
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

export type SubscriptionData =  {
  id: number;
  title: string;
  info: string;
  src: string;
  loc: string;
  sup: string;
  status: string;
};

const CustomTable: React.FC<TableData> = ({columns, data, className}) => {
  const subscriptions = useSubscriptions()
  const dispatch = useDispatch()

  const [isAddModalWindowOpened, setIsAddModalWindowOpened] = useState(false)
  const [isEditModalWindowOpened, setIsEditModalWindowOpened] = useState(false)
  const [isDeleteModalWindowOpened, setIsDeleteModalWindowOpened] = useState(false)
  const [isImageModalWindowOpened, setIsImageModalWindowOpened] = useState(false)

  const [subscriptionTitleValue, setSubscriptionTitleValue] = useState('')
  const [subscriptionInfoValue, setSubscriptionInfoValue] = useState('')
  const [currentSubscriptionId, setCurrentSubscriptionId] = useState<number>()
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState('')
  const [supportHoursValue, setSupportHoursValue] = useState('');
  const [locationServiceValue, setLocationServiceValue] = useState('');
  const [isValid, setIsValid] = useState(false)

  const postSubscription = async () => {
    try {
      const response = await axios(`http://localhost:8000/api/services/post/`, {
        method: 'POST',
        data: {
          service_name: subscriptionTitleValue,
          description: subscriptionInfoValue,
          location_service: locationServiceValue,
          support_hours: supportHoursValue,
          status: "operating"
        },
        withCredentials: true
      })

      setIsAddModalWindowOpened(false)
      dispatch(setSubscriptionsAction([...subscriptions, {
        id: response.data.id_service,
        title:  response.data.service_name,
        info: response.data.description,
        loc: response.data.location_service,
        sup: response.data.support_hours,
        src: '',
      }]))
      toast.success('Услуга успешно добавлена!')
    } catch(e) {
      toast.error('Услуга с таким названием уже существует!')
    }
  }

  const putSubscription = async (id: number) => {
    try {
      const response = await axios(`http://localhost:8000/api/services/${id}/put/`, {
        method: 'PUT',
        data: {
          service_name: subscriptionTitleValue,
          description: subscriptionInfoValue,
          location_service: locationServiceValue,
          support_hours: supportHoursValue,
          status: "operating"
        },
        withCredentials: true
      })
      setIsEditModalWindowOpened(false)
      const updatedSubscriptions = subscriptions.map(subscription => {
        if (subscription.id === id) {
          return {
            ...subscription,
            title: response.data.service_name,
            info: response.data.description,
            src: response.data.image,
            loc: response.data.location_service,
            sup: response.data.support_hours
          };
        }
        return subscription;
      });

      dispatch(setSubscriptionsAction(updatedSubscriptions))
      toast.success('Информация успешно обновлена!')
    } catch(e) {
      toast.error('Услуга с таким названием уже существует!')
    }
  }
  
  const deleteSubscription = async () => {
    try {
      await axios(`http://localhost:8000/api/services/${currentSubscriptionId}/delete/`, {
        method: 'DELETE',
        withCredentials: true,

      })

      dispatch(setSubscriptionsAction(subscriptions.filter((subscription) => {
        return subscription.id !== currentSubscriptionId 
      })))
      setIsDeleteModalWindowOpened(false)
      toast.success('Услуга успешно удалена!')
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
          `http://localhost:8000/api/services/${currentSubscriptionId}/image/`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
          }
        );
        const updatedSubscriptions = subscriptions.map(subscription => {
          if (subscription.id === currentSubscriptionId) {
            return {
              ...subscription,
              src: response.data
            };
          }
          return subscription;
        });
        dispatch(setSubscriptionsAction(updatedSubscriptions))
        console.log(updatedSubscriptions)
        setSelectedImage(null)
        toast.success('Изображение успешно загружено')

      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setIsImageModalWindowOpened(false)
      }
    }
  };

  const handleSubscriptionFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isAddModalWindowOpened) {
      postSubscription()
    } else if(currentSubscriptionId) {
      putSubscription(currentSubscriptionId)
    }
  }

  const handleEditButtonClick = (subscription: SubscriptionData) => {
    setCurrentSubscriptionId(subscription.id)
    setIsEditModalWindowOpened(true);
    setSubscriptionTitleValue(subscription.title)
    setSubscriptionInfoValue(subscription.info)
    setLocationServiceValue(subscription.loc)
    setSupportHoursValue(subscription.sup)
  }

  const handleDeleteButtonClick = (id: number) => {
    setCurrentSubscriptionId(id)
    setIsDeleteModalWindowOpened(true)
  }

  const handleImageButtonClick = (subscription: SubscriptionData) => {
    setCurrentSubscriptionId(subscription.id)
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
    <span className={`${styles['table__add-text']}`}>Хотите добавить новую услугу ?</span><AddButton onClick={() => setIsAddModalWindowOpened(true)}/>
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

        <ModalWindow handleBackdropClick={() => {setIsAddModalWindowOpened(false); setIsEditModalWindowOpened(false); subscriptionTitleValue && setSubscriptionTitleValue(''); subscriptionInfoValue && setSubscriptionInfoValue(''); locationServiceValue && setLocationServiceValue(''); supportHoursValue && setSupportHoursValue('');locationServiceValue && setLocationServiceValue('')}}
        className={styles.modal} active={isAddModalWindowOpened || isEditModalWindowOpened}>
          <h3 className={styles.modal__title}>Заполните данные</h3>
          <Form onSubmit={(event: React.FormEvent<HTMLFormElement>) => handleSubscriptionFormSubmit(event)}
          className={styles['form']}>
            <div className={styles.form__item}>
              <Form.Control onChange={(event: ChangeEvent<HTMLInputElement>) => {setSubscriptionTitleValue(event.target.value)}} value={subscriptionTitleValue} className={styles.form__input} type="text" placeholder="Название услуги*" />
            </div>
            
            <div className={styles.form__item}>
              <Form.Control
                as="textarea"
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setSubscriptionInfoValue(event.target.value)}
                value={subscriptionInfoValue}
                className={styles.form__textarea}
                placeholder="Описание*"
                style={{borderColor: 'black'}}
              />
            </div>
            <div className={styles.form__item}>
            <Form.Control
              onChange={(event: ChangeEvent<HTMLInputElement>) => setSupportHoursValue(event.target.value)}
              value={supportHoursValue}
              className={styles.form__input}
              type="text"
              placeholder="Часы поддержки*"
            />
          </div>

          <div className={styles.form__item}>
            <Form.Control
              onChange={(event: ChangeEvent<HTMLInputElement>) => setLocationServiceValue(event.target.value)}
              value={locationServiceValue}
              className={styles.form__input}
              type="text"
              placeholder="Место оказания услуги*"
            />
          </div>
            <Button disabled={!subscriptionTitleValue || !subscriptionInfoValue} type='submit'>Сохранить</Button>
          </Form>
        </ModalWindow>

        <ModalWindow handleBackdropClick={() => setIsDeleteModalWindowOpened(false)} active={isDeleteModalWindowOpened} className={styles.modal}>
          <h3 className={styles.modal__title}>Вы уверены, что хотите удалить данную усулугу?</h3>
          <div className={styles['modal__delete-btns']}>
            <Button onClick={() => {deleteSubscription()}} className={styles.modal__btn}>Подтвердить</Button>
            <Button onClick={() => setIsDeleteModalWindowOpened(false)} className={styles.modal__btn}>Закрыть</Button>
          </div>
        </ModalWindow>

        {/* <ModalWindow handleBackdropClick={() => setIsDeleteModalWindowOpened(false)} active={isDeleteModalWindowOpened} className={styles.modal}>
          <h3 className={styles.modal__title}>Вы уверены, что хотите удалить данную комнату?</h3>
          <div className={styles['modal__delete-btns']}>
            <Button onClick={() => {deleteSubscription()}} className={styles.modal__btn}>Подтвердить</Button>
            <Button onClick={() => setIsDeleteModalWindowOpened(false)} className={styles.modal__btn}>Закрыть</Button>
          </div>
        </ModalWindow> */}

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