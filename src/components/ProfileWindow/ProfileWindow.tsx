import * as React from 'react';
import cn from 'classnames'
import styles from './ProfileWindow.module.scss';
import Button from 'react-bootstrap/Button'
import ProfileLogoIcon from 'components/Icons/ProfileLogoIcon';
import { Link } from 'react-router-dom';

export type ModalProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    onClick?: () => void;
    className?: string;
    email: string;
    full_name: string | undefined;
    phone_number: string;
};

const ProfileWindow: React.FC<ModalProps> = ({
    email,
    full_name,
    phone_number,
    className,
    onClick,

}) => {
    return (
        console.log(email),
        <div className={cn(styles.modal, className)}>
            <div className={styles.title__block}>
                <h3 className={styles.modal__title}>Ваш профиль</h3>
            </div>
            
            <div className={styles.info}>
                <div className={styles.username__info}>
                    <div>
                        <h4 className={styles.info__title}>E-mail: </h4>
                        <h5 className={styles.info__value}>{email}</h5>
                    </div>
                    <div>
                        <h4 className={styles.info__title}>ФИО: </h4>
                        <h5 className={styles.info__value}>{full_name}</h5>
                    </div>
                    <div>
                        <h4 className={styles.info__title}>Номер телефона: </h4>
                        <h5 className={styles.info__value}>{phone_number}</h5>
                    </div>
                </div>
            </div>
            <Button style={{backgroundColor: 'black'}} className={styles.modal__btn} onClick={onClick}>Выйти</Button>
            
        </div>
    )
};

export default ProfileWindow;