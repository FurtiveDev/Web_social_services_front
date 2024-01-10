import React from 'react';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image'
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { useIsAuth, useUser } from 'Slices/AuthSlice';
import styles from './Card.module.scss'

export type CardProps = {
  id?: number,
  src?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  price?: number;
  onButtonClick?: React.MouseEventHandler;
  onImageClick?: React.MouseEventHandler;
};

const OneCard: React.FC<CardProps> = ({id, title,description,src, onButtonClick, onImageClick }) => {
  const isUserAuth = useIsAuth();
  const user = useUser();
  const isSuperuser = user?.isSuperuser; // We get the isSuperuser status from the user object
  return (
    <Card className={styles.card}>
      <Link className={styles['card__image-link']} to={`/services/${id}`}>
        <div className={styles['card__image-wrapper']}>
          <Image
            className={styles.card__image}
            onClick={onImageClick}
            src={src ? src : "https://www.solaredge.com/us/sites/nam/files/Placeholders/Placeholder-4-3.jpg"}
            rounded
          />
        </div>
      </Link>
      <Card.Body className={`d-flex flex-column ${styles.card__info}`}>
      <Card.Title className='pt-3'><strong>{title}</strong></Card.Title>
        <Card.Subtitle>
        <strong>Описание:</strong> {description}
        </Card.Subtitle>
        {isUserAuth && !isSuperuser && (
        <div className={`mt-auto w-100 ${styles['card__button-wrapper']}`}>
          <Button className={styles.card__button} onClick={onButtonClick} variant="primary">Добавить</Button>
        </div>)}
      </Card.Body>
    </Card>
  );
};

export default OneCard;