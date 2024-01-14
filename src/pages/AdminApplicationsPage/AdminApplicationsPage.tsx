import React, {ChangeEvent, useState, useEffect} from 'react'
import axios from 'axios'
import styles from './AdminApplicationsPage.module.scss'
import Header from 'components/Header'
import { useDispatch } from 'react-redux'
import { useApplications, setApplicationsAction } from 'Slices/ApplicationsSlice'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Dropdown } from 'react-bootstrap'
import ArrowDownIcon from 'components/Icons/ArrowDownIcon'
import AdminApplicationsTable from 'components/AdminApplicationsTable'
import { useLinksMapData, setLinksMapDataAction } from 'Slices/DetailedSlice'

const statuses = ["Все", "на рассмотрении",'отказано', "принято", "зарегистрирован"]

export type ReceivedApplicationData = {
  id_request: number;
  status: string;
  creation_date: string;
  completion_date: string;
  user:string;
}

export type ApplicationData = {
  id: number;
  status: string;
  creation_date: string;
  completion_date: string;
  user: string;
}

const AdminApplicationsPage = () => {
  const applications = useApplications()
  const linksMapData = useLinksMapData()
  const dispatch = useDispatch()
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [statusValue, setStatusValue] = useState(statuses[0])
  const [user, setEmailValue] = useState('')

  const getAllApplications = async () => {
    let res = ''
    if (startTime && endTime) {
      res += `?start=${startTime}&end=${endTime}`
    } else if(startTime) {
      res += `?start=${startTime}`
    } else if(endTime) {
      res += `?end=${endTime}`
    }

    if (res.length === 0 && statusValue !== 'Все') {
      res += `?status=${statusValue}`
    } else if (res.length !== 0 && statusValue !== 'Все'){
      res += `&status=${statusValue}`
    }

    try {
      const response = await axios(`http://localhost:8000/api/requests/${res}`, {
      method: 'GET',
      withCredentials: true,
    })
      
      const newArr = response.data.map((raw: ReceivedApplicationData) => ({
        id: raw.id_request,
        status: raw.status,
        creation_date: raw.creation_date,
        completion_date: raw.completion_date,
        user: raw.user
    }));
    dispatch(setApplicationsAction(newArr.filter((application: ApplicationData) => {
      return application.user ? application.user.includes(user) : false;
    })));
    dispatch(setApplicationsAction(newArr))
    } catch(error) {
      throw error
    }
  };
  React.useEffect(() => {
    dispatch(setApplicationsAction(applications.filter((application: ApplicationData) => {
      return application.user ? application.user.includes(user) : false;
    })));
  }, [user])

  React.useEffect(() => {
    
  }, [])


  useEffect(() => {
    const intervalId = setInterval(getAllApplications, 2000);

    return () => clearInterval(intervalId);
  }, [startTime, endTime, statusValue]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    getAllApplications()
  }

  const handleCategorySelect = (eventKey: string | null) => {
    if (eventKey !== null) {
      const selectedStatus = statuses.find(status => status === eventKey)
      if (selectedStatus && selectedStatus !== statusValue && selectedStatus) {
        setStatusValue(selectedStatus)
      }
    }
};


  return (
    <div className={styles.admin__page}>
      <Header></Header>
        <div className={styles['admin__page-wrapper']}>
          <h1 className={styles['admin__page-title']}>Заявки всех пользователей</h1> 
          <Form onSubmit={(event: React.FormEvent<HTMLFormElement>) => handleFormSubmit(event)}
          className={styles['form']}>
              <div className={styles.form__item}>
                <Form.Control onChange={(event: ChangeEvent<HTMLInputElement>) => {setStartTime(event.target.value)}} value={startTime} className={styles.form__input} type="date" placeholder="Начальная дата*" />
              </div>
              <div className={styles.form__item}>
                <Form.Control onChange={(event: ChangeEvent<HTMLInputElement>) => {setEndTime(event.target.value)}} value={endTime} className={styles.form__input} type="date" placeholder="Конечная дата*" />
              </div>

              <div className={styles.form__item}>
              <Dropdown className={styles['dropdown']} onSelect={handleCategorySelect}>
                <Dropdown.Toggle
                    className={styles['dropdown__toggle']}
                    style={{
                        borderColor: 'black',
                        backgroundColor: "#fff",
                        color: '#000',
                    }}
                >   
                    {statusValue}
                    <ArrowDownIcon className={styles.dropdown__icon}/>
                </Dropdown.Toggle>
                <Dropdown.Menu className={styles['dropdown__menu']}>
                    {statuses
                    .map(status => (
                        <Dropdown.Item className={styles['dropdown__menu-item']} key={status} eventKey={status}>
                        {status}
                        </Dropdown.Item>
                    ))}
                    </Dropdown.Menu>
                </Dropdown>
              </div>
              <div className={styles.form__item}>
              <Form.Control 
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setEmailValue(event.target.value);
              }} 
              value={user} 
              className={styles.form__input} 
              type="text" 
              placeholder="E-mail *" 
              />
              </div>
              <Button className={styles.form__btn} type='submit'>Найти</Button>
          </Form>
          <AdminApplicationsTable></AdminApplicationsTable>
        </div>
    </div>
  )
}

export default AdminApplicationsPage