import React from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from './SubscriptionsTable.module.scss'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import cn from 'classnames';
import { useDispatch } from 'react-redux';
import BasketIcon from 'components/Icons/BasketIcon';
import { useNavigate } from 'react-router-dom';
import { useCurrentApplicationDate, useSubscripitonsFromApplication,
  setCurrentApplicationDateAction, setSubscriptionsFromApplicationAction, setCurrentApplicationIdAction } from 'Slices/ApplicationsSlice'

interface SubscriptionData {
  id: number,
  title: string,
  info: string,
  src: string,
  loc: string,
  sup: string,
}

export type SubscriptionsTableProps = {
  subscriptions: SubscriptionData[];
  className?: string;
  flag?: boolean;
};

const SubscriptionsTable: React.FC<SubscriptionsTableProps> = ({subscriptions, className, flag}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const subscripions = useSubscripitonsFromApplication()

  const deleteSubscriptionFromApplication = async (id: number) => {
    try {
      const response = await axios(`http://localhost:8000/api/services_requests/${id}/delete/`, {
        method: 'DELETE',
        withCredentials: true
      });
  
  
      dispatch(setSubscriptionsFromApplicationAction(subscripions.filter(subscription => subscription.id !== id)));
  
    } catch(error) {
      console.error(error);
    }
  }

  const handleDeleteButtonClick = (id: number) => {
    deleteSubscriptionFromApplication(id);
    if (subscriptions.length === 1) {
      setTimeout(() => {
        navigate('/requests');
      }, 200);
    }
  };

  return (
    <div className={styles.table__container}>
        <Table responsive borderless className={!className ? styles.table : cn(styles.table, className)}>
            <thead>
                <tr className={styles.tableHead}>
                    <th>№</th>
                    <th>Название услуги</th>
                    <th>Время работы</th>
                    <th>Локация</th>
                    {!flag && <th>Действия</th>}
                    {flag && <th></th>} {/* Пустая ячейка, если flag равен true */}
                </tr>
            </thead>
            <tbody>
                {subscriptions.map((subscription: SubscriptionData, index: number) => (
                    <tr key={subscription.id}>
                        <td>{index + 1}</td>
                        <td>{subscription.title}</td>
                        <td>{subscription.sup}</td>
                        <td>{subscription.loc}</td>
                        {!flag && (
                            <td className={styles.table__action}>
                                <BasketIcon onClick={() => handleDeleteButtonClick(subscription.id)} />
                            </td>
                        )}
                        {flag && <td></td>} {/* Пустая ячейка, если flag равен true */}
                    </tr>
                ))}
            </tbody>
        </Table>
    </div>
)
}

export default SubscriptionsTable