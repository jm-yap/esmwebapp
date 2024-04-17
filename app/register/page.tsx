import React, { FormEvent } from 'react';
import Form from './form';
import styles from './styles.module.css';


async function Register() {
    return (
        <div className={styles.container}>
            <div className={styles.centerBox}>
                <div className={styles.divider1}>
                    <div className={styles.title}>
                    <p>Sagot</p>
                    <p className={styles.titleOrange}>Kita</p>
                    <p>.</p>
                </div>  
                <p className={styles.subtitle}>Create an</p>
                <p className={styles.subtitle}>account</p>

                </div>
                <div className={styles.divider2}>
                    <Form />
                </div>
            </div>
        </div>
    );
}

export default Register;