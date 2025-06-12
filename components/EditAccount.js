import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changePseudo, changeEmail } from "../reducers/user";
import styles from '../styles/EditAccount.module.css';


function EditAccount(props) {
    const user = useSelector((state) => state.user.value);
    const dispatch = useDispatch();
    const [value, setValue] = useState('');
    const [password, setPassword] = useState('');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL + 'accounts/';
    const urls = {
        'pseudo': 'pseudo',
        'email': 'email',
        'mot de passe': 'password'
    }

    const handleSubmit = () => {
        fetch(baseUrl + urls[props.field], {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + user.token,
            },
            body: JSON.stringify({ newValue: value, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.result) {
                setValue('');
                setPassword('');
                alert('Modification bien effectuée');
                if (props.field === 'pseudo') dispatch(changePseudo({pseudo: value}));
                else if (props.field === 'email') dispatch(changeEmail({email: value, token: data.token}));
            } else {
                alert('Erreur. ' + data.error)
            }
        });
    }

    return (
        <div className={styles.container}>
            <label htmlFor="field">{`Nouveau ${props.field}`}</label>
            <input className={styles.input} type={props.type} id="field" name="field" placeholder={`nouveau ${props.field}`} onChange={(e) => setValue(e.target.value)} value={value} />

            <label htmlFor="mdp">Mot de passe</label>
            <input className={styles.input} type="password" id="mdp" name="mdp" placeholder='mot de passe' onChange={(e) => setPassword(e.target.value)} value={password} />

            <button onClick={handleSubmit}>Modifier</button>
        </div>
    );
}

export default EditAccount;