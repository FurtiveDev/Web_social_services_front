import React from 'react';
import Header from 'components/Header';
import styles from './MainPage.module.scss';
import image from '../../assets/disability_support.jpg';

const MainPage = () => {
    return (
        <div className={styles.main__page}>
            <Header/>
            <div className={styles['main__page-intro']}>
                <h1 className={styles['main__page-title']}>Социальная помощь инвалидам</h1>
                <h4 className={styles['main__page-subtitle']}>Система поддержки и помощи людям с ограниченными возможностями</h4>
            </div>
            {/* <img src={image} className={styles['main__page-image']} alt="main image" /> */}
            
            <div className={styles['main__page-wrapper']}>
                <div className={styles['main__page-about']}>
                    <h2 className={styles['main__page-part-title']}>О программе</h2>
                    <div className={styles['main__page-about-wrapper']}>
                        <ul className={styles['main__page-about-info']}>
                            <li className={styles['main__page-about-item']}>Мы предоставляем информацию о доступных услугах для людей с инвалидностью.</li>
                            <li className={styles['main__page-about-item']}>У нас есть каталог средств реабилитации, доступных для заказа.</li>
                            <li className={styles['main__page-about-item']}>Мы организуем мероприятия и курсы для социальной адаптации и интеграции.</li>
                            <li className={styles['main__page-about-item']}>Наша команда оказывает консультационную и юридическую поддержку.</li>
                            <li className={styles['main__page-about-item']}>Вы можете подать заявку на получение помощи или поддержки через наш сайт.</li>
                            <li className={styles['main__page-about-item']}>Мы работаем для обеспечения равных возможностей и улучшения качества жизни.</li>
                        </ul>

                        <div className={styles['main__page-stats']}>
                            <div className={styles['main__page-stats-item']}>
                                <h3 className={styles['main__page-stats-title']}>500+</h3>
                                <p className={styles['main__page-stats-subtitle']}>Пользователей системы</p>
                            </div>

                            <div className={styles['main__page-stats-item']}>
                                <h3 className={styles['main__page-stats-title']}>200+</h3>
                                <p className={styles['main__page-stats-subtitle']}>Средств реабилитации</p>
                            </div>

                            <div className={styles['main__page-stats-item']}>
                                <h3 className={styles['main__page-stats-title']}>100+</h3>
                                <p className={styles['main__page-stats-subtitle']}>Организованных мероприятий</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainPage