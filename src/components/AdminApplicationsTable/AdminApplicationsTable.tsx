import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from './AdminApplicationsTable.module.scss'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import cn from 'classnames';
import { useDispatch } from 'react-redux';
import { useApplications, setApplicationsAction } from 'Slices/ApplicationsSlice'
import { useNavigate } from 'react-router-dom';
import CancelIcon from 'components/Icons/CancelIcon';
import AcceptIcon from 'components/Icons/AcceptIcon';

interface ApplicationData {
  id: number;
  status: string;
  creation_date: string;
  completion_date: string;
  user: string;
  service_provided: boolean;
}

interface ServiceData {
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
export type ReceivedServiceData = {
  id_service: number,
  service_name: string,
  description: string,
  status: string,
  image: string,
  support_hours: string,
  location_service: string,
}

export type ServicesTableProps = {
  className?: string;
};

export type ReceivedApplicationData = {
  id_request: number;
  status: string;
  creation_date: string;
  completion_date: string;
  user:string;
  service_provided: boolean;
}

const AdminApplicationsTable: React.FC<ServicesTableProps> = ({className}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const applications = useApplications()
  const [isModalWindowOpened, setIsModalWindowOpened] = useState(false);
  const [currentServices, setCurrentServices] = useState<ServiceData[]>([])

  const getAllApplications = async () => {
    try {
      const response = await axios('http://localhost:8000/api/requests/', {
        method: 'GET',
        withCredentials: true
      })
      const newArr = response.data.map((row: ReceivedApplicationData) => ({
        id: row.id_request,
        status: row.status,
        creaction_date: row.creation_date,
        completion_date: row.completion_date,
        user: row.user,
        service_provided: row.service_provided
      }));

      dispatch(setApplicationsAction(newArr.filter((application: ApplicationData) => {
        return applications.includes(application)
      })));
    } catch(error) {
      throw error
    }
   }

  const getCurrentApplication = async (id: number) => {
    try {
      const response = await axios(`http://localhost:8000/api/requests/${id}`, {
        method: 'GET',
        withCredentials: true,
      })
      const newArr = response.data.services.map((raw: ReceivedServiceData) => ({
        id: raw.id_service,
        title: raw.service_name,
        info: raw.description,
        src: raw.image,
        loc: raw.location_service,
        sup: raw.support_hours
    }));
    setCurrentServices(newArr)
    console.log('newArr is', newArr)
    } catch(error) {
      throw error;
    }
  }

  const putApplication = async (id: number, isAccepted: boolean) => {
    try {
      let response: any;
      if (isAccepted) {
        response = await axios(`http://localhost:8000/api/requests/${id}/AdminPut/`, {
          method: 'PUT',
          data: {
            status: "принято"
          },
          withCredentials: true
        })
        toast.success('Заявка успешно принята!')
      } else {
        response = await axios(`http://localhost:8000/api/requests/${id}/AdminPut/`, {
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
            completion_date: response.data.completion_date,
            // activeDate: response.data.active_date,
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
  

 
  const handleAcceptButtonClick = (id: number) => {
    putApplication(id, true)
  }

  const handleCancelButtonClick = (id: number) => {
    putApplication(id, false)
  }
 
  const handleClick = (id: number) => {
    navigate(`/requests/${id}`, { state: { flag: true } });
  };

  return (
    <>
    <div className={styles.table__container}>
    <Table hover responsive borderless className={!className ? styles.table : cn(styles.table, className)}>
        <thead>
          <tr className={styles.tableHead}>
            <th>№</th>
            <th>Пользователь</th>
            <th>Статус</th>
            <th>Дата создания</th>
            <th>Факт оказания</th>
            <th>Дата завершения</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application: ApplicationData, index: number) => (
            
            <tr key={application.id}>
              {application.status !== 'зарегистрирован' && <>
              <td>{++index}</td>
              <td>{application.user}</td>
              <td>{application.status}</td>
              <td>{application.creation_date}</td>
              <td>
                {application.service_provided === true ? '✓' : 
                application.service_provided === false ? '✗' : 
                '-'}
              </td>
              <td>{application.completion_date ? application.completion_date : '-'}</td>
              <td className={styles.table__action}>
                {/* <Link to={`/applications/${application.id}`}> */}
                <Button className={styles.table__btn} onClick={() => handleClick(application.id)}>Детали</Button>
                {/* </Link> */}
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

    </>
  );
}

export default AdminApplicationsTable