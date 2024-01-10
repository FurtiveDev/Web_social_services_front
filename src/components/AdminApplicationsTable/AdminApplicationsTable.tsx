import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from './AdminApplicationsTable.module.scss'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import ModalWindow from 'components/ModalWindow'
import cn from 'classnames';
import { useDispatch } from 'react-redux';
import { useCurrentApplicationDate, useSubscripitonsFromApplication,
  setCurrentApplicationDateAction, setSubscriptionsFromApplicationAction, setCurrentApplicationIdAction, useApplications, setApplicationsAction } from 'Slices/ApplicationsSlice'
import { Link } from 'react-router-dom';
import CancelIcon from 'components/Icons/CancelIcon';
import AcceptIcon from 'components/Icons/AcceptIcon';
import BreadCrumbs from 'components/BreadCrumbs'
import { userInfo } from 'os';



interface ApplicationData {
  id: number;
  status: string;
  creation_date: string;
  completion_date: string;
}

interface SubscriptionData {
  id: number;
  title: string;
  info: string;
  src: string;
  loc: string;
  sup: string;
}
export type ReceivedUserData = {
  id: number,
  email: string,
  full_name: string,
  phone_number: string,
  password: string,
  is_superuser: boolean,
}
export type ReceivedSubscriptionData = {
  id_service: number,
  service_name: string,
  description: string,
  status: string,
  image: string,
  support_hours: string,
  location_service: string,
}

export type SubscriptionsTableProps = {
  className?: string;
};

export type ReceivedApplicationData = {
  id_request: number;
  status: string;
  creation_date: string;
  completion_date: string;
}

const AdminApplicationsTable: React.FC<SubscriptionsTableProps> = ({className}) => {
  const dispatch = useDispatch();
  const applications = useApplications()
  const [isModalWindowOpened, setIsModalWindowOpened] = useState(false);
  const [currentSubscriptions, setCurrentSubscriptions] = useState<SubscriptionData[]>([])

  // const getAllApplications = async () => {
  //   try {
  //     const response = await axios('http://localhost:8000/api/requests/', {
  //       method: 'GET',
  //       withCredentials: true
  //     })
  //     const newArr = response.data.map((raw: ReceivedApplicationData) => ({
  //       id: raw.id_request,
  //       status: raw.status,
  //       creation_date: raw.creation_date,
  //       completion_date: raw.completion_date,
  //     }));
  //     dispatch(setApplicationsAction(newArr))
  //   } catch(error) {
  //     throw error
  //   }
  //  }
   

  const getCurrentApplication = async (id: number) => {
    try {
      const response = await axios(`http://localhost:8000/api/requests/${id}`, {
        method: 'GET',
        withCredentials: true,
      })
      const newArr = response.data.map((raw: ReceivedSubscriptionData) => ({
        id: raw.id_service,
        title: raw.service_name,
        info: raw.description,
        src: raw.image,
        status: raw.status,
        loc: raw.location_service,
        sup: raw.support_hours
    }));
    setCurrentSubscriptions(newArr)
    console.log('newArr is', newArr)
    } catch(error) {
      throw error;
    }
  }

  const putApplication = async (id: number, isAccepted: boolean) => {
    try {
      if (isAccepted) {
        await axios(`http://localhost:8000/api/requests/${id}/AdminPut/`, {
          method: 'PUT',
          data: {
            status: "принято"
          },
          withCredentials: true
        })
        toast.success('Заявка успешно принята!')
      } else {
        await axios(`http://localhost:8000/api/requests/${id}/AdminPut/`, {
          method: 'PUT',
          data: {
            status: "отказано"
          },
          withCredentials: true
        })
        toast.success('Заявка успешно отклонена!')
      }

      const updatedApplications = applications.map(application => {
        if (application.id === id) {
          return {
            ...application,
            status: isAccepted ? 'принято' : 'отказано'
          };
        }
        return application;
      });
      // getAllApplications()

      dispatch(setApplicationsAction(updatedApplications))
    } catch(e) {
      throw e
    }
  }
  

  const handleDetailedButtonClick = (id: number) => {
    getCurrentApplication(id)
    setIsModalWindowOpened(true)
  };

  const handleAcceptButtonClick = (id: number) => {
    putApplication(id, true)
  }

  const handleCancelButtonClick = (id: number) => {
    putApplication(id, false)
  }

  React.useEffect(() => {
    // const intervalId = setInterval(getAllApplications, 2000);
    // return () => clearInterval(intervalId);
  }, [])

  return (
    <>
    <div className={styles.table__container}>
    <Table responsive borderless className={!className ? styles.table : cn(styles.table, className)}>
        <thead>
          <tr className={styles.tableHead}>
            <th>№</th>
            <th>Статус</th>
            <th>Дата создания</th>
            <th>Дата завершения</th>
            <th>Действие</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application: ApplicationData, index: number) => (
            <tr key={application.id}>
              {application.status !== 'Зарегистрирован' && <> 
              <td>{++index}</td>
              <td>{application.status}</td>
              <td>{application.creation_date}</td>
              <td>{application.completion_date ? application.completion_date : '-'}</td>
              <td className={styles.table__action}>
                <Link to={`/requests/${application.id}`}>
                  <Button className={styles.table__btn}>Детали</Button>
                </Link>
                {/* <Link to={`/applications/${application.id}`}> */}
                  {/* <Button onClick={() => handleDetailedButtonClick(application.id)}>Подробнее</Button> */}
                  {application.status === 'на рассмотрении' && <><CancelIcon onClick={() => handleCancelButtonClick(application.id)}></CancelIcon>
                  <AcceptIcon onClick={() => handleAcceptButtonClick(application.id)}></AcceptIcon></>}
                {/* </Link> */}
              </td>
              </>}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>

      <ModalWindow handleBackdropClick={() => setIsModalWindowOpened(false)} className={styles.modal} active={isModalWindowOpened}>
      <h3 className={styles.modal__title}>Добавленные услуги</h3>
      <div className={styles.modal__list}>
        {currentSubscriptions.map((subscription: SubscriptionData, index: number) => (
          <div className={styles['modal__list-item']}>
            <div className={styles['modal__list-item-title']}>
               "{subscription.title}"
            </div>
          </div>
        ))}
      </div>
      </ModalWindow>
    </>
  );
}

export default AdminApplicationsTable