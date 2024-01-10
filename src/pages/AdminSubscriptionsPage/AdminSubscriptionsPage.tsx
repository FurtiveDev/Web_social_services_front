import React, { useState, ChangeEvent } from 'react'
import styles from './AdminSubscriptionsPage.module.scss'
import {useDispatch} from "react-redux";
import {useTitleValue, useSubscriptions, setTitleValueAction, setSubscriptionsAction} from "../../Slices/MainSlice";
import { toast } from 'react-toastify';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import { Dropdown } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Header from 'components/Header';
import CustomTable from 'components/CustomTable';
import ModalWindow from 'components/ModalWindow';
import ArrowDownIcon from 'components/Icons/ArrowDownIcon';
import EditIcon from 'components/Icons/EditIcon';
import BasketIcon from 'components/Icons/BasketIcon';
import AddButton from 'components/Icons/AddButton';
import BreadCrumbs from 'components/BreadCrumbs'




export type ReceivedSubscriptionData = {
    id_service: number,
    service_name: string,
    description: string,
    status: string,
    image: string,
    support_hours: string,
    location_service: string,
}

export type CategoryData = {
    id: number;
    title: string;
}

const columns = [
    {
        key: 'title',
        title: 'Название услуги'
    },
    
]

const AdminSubscriptionsPage = () => {
    const dispatch = useDispatch()
    const subscriptions = useSubscriptions()
    const [newCategoryValue, setNewCategoryValue] = useState('')
    const [isAddModalWindowOpened, setIsAddModalWindowOpened] = useState(false)
    const [isEditModalWindowOpened, setIsEditModalWindowOpened] = useState(false)
    const [isDeleteModalWindowOpened, setIsDeleteModalWindowOpened] = useState(false)
    const [isSubscriptionsShow, setIsSubscriptionsShow] = useState(true)




    const handleAddButtonClick = () => {
        setIsAddModalWindowOpened(true)
    }

    const handleDeleteButtonClick = () => {
        setIsDeleteModalWindowOpened(true)
    }


    
    React.useEffect(() => {
        console.log(11111)
    }, [])
  return (
    <div className={styles.admin__page}>
        <Header/>
        <div className={styles['admin__page-wrapper']}>
        {!isSubscriptionsShow && <div className={styles['admin__page-categories']}>
                    <h1 className={styles['admin__page-title']}>Управление категориями</h1>
                    <div className={styles['admin__page-categories-content']}>
                            <div className={styles['admin__page-categories-actions']}>
                            <td className={styles.table__action}>
                                <AddButton onClick={() => handleAddButtonClick()}/>
                                <BasketIcon onClick={() => handleDeleteButtonClick()}/>
                            </td>
                        </div>
                    </div>
                </div>}
            {isSubscriptionsShow && <><h1 className={styles['admin__page-title']}>Список услуг</h1>

            <div className={styles['admin__page-title']}>
                <CustomTable className={styles['admin__page-table']} data={subscriptions} 
                columns={columns} flag={2} ></CustomTable>
            </div>
            </>}
                    
        </div>
        <ModalWindow handleBackdropClick={() => {setIsAddModalWindowOpened(false); setIsEditModalWindowOpened(false); newCategoryValue && setNewCategoryValue('')}}
                className={styles.modal} active={isAddModalWindowOpened || isEditModalWindowOpened}>
                <h3 className={styles.modal__title}>Заполните данные</h3>
            </ModalWindow>
    </div>
  )
}

export default AdminSubscriptionsPage