import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setServicesAction, useServices } from "Slices/MainSlice"; // Adjust this import to your actual file structure
import Header from 'components/Header';
import styles from './AddServicePage.module.scss';
const AddServicePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const subscriptions = useServices();
  const [title, setTitle] = useState('');
  const [info, setInfo] = useState('');
  const [loc, setLoc] = useState('');
  const [sup, setSup] = useState('');

  const postService = async () => {
    try {
      const response = await axios(`http://localhost:8000/api/services/post/`, {
        method: 'POST',
        data: {
          service_name: title,
          description: info,
          location_service: loc,
          support_hours: sup,
          status: "operating"
        },
        withCredentials: true
      });

      dispatch(setServicesAction([...subscriptions, {
        id: response.data.id_service,
        title: response.data.service_name,
        info: response.data.description,
        loc: response.data.location_service,
        sup: response.data.support_hours,
        src: '', // Assuming there's a default or placeholder image path
      }]));

      navigate('/admin');
    } catch (e) {
      console.error(e);
    }
  }

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await postService();
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.form}>
        <h1>Добавление услуги</h1>
        <form onSubmit={handleFormSubmit}>
          <div>
            <label htmlFor="title">Название услуги:</label>
            <input
              className={styles.input}
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="info">Описание:</label>
            <textarea
              className={styles.textarea}
              id="info"
              value={info}
              onChange={(e) => setInfo(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="loc">Место оказания услуги:</label>
            <input
              className={styles.input}
              id="loc"
              type="text"
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="sup">Часы поддержки:</label>
            <input
              className={styles.input}
              id="sup"
              type="text"
              value={sup}
              onChange={(e) => setSup(e.target.value)}
            />
          </div>
          <button className={styles.button} type="submit">Добавить услугу</button>
        </form>
      </div>
    </div>
  );
};

export default AddServicePage;