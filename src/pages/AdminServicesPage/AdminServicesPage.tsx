import React, { useState, ChangeEvent } from 'react'
import styles from './AdminServicesPage.module.scss'
import {useDispatch} from "react-redux";
import {useTitleValue, useServices, setTitleValueAction, setServicesAction} from "../../Slices/MainSlice";
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


const columns = [
    {
        key: 'title',
        title: 'Название услуги'
    },
    
]

const AdminServicesPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const subscriptions = useServices()
    const [isServicesShow, setIsServicesShow] = useState(true)



    
    React.useEffect(() => {
    }, [])
  return (
    <div className={styles.admin__page}>
        <Header/>
        <div className={styles['admin__page-wrapper']}>
            {isServicesShow && <><h1 className={styles['admin__page-title']}>Список услуг</h1>

            <div className={styles['admin__page-title']}>
                <CustomTable className={styles['admin__page-table']} data={subscriptions} 
                columns={columns} flag={2} ></CustomTable>
            </div>
            </>}
                    
        </div>
    </div>
  )
}

export default AdminServicesPage