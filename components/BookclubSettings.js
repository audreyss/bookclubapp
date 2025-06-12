import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import styles from '../styles/BookclubSettings.module.css';

function BookclubSettings(props) {
    const { user, bookclub } = props;
    const [name, setName] = useState('');
    const [privacy, setPrivacy] = useState(false);
    const [desc, setDesc] = useState('');
    const [icon, setIcon] = useState(null);
    const [iconURL, setIconURL] = useState('');

    useEffect(() => {
        setName(bookclub?.name);
        setPrivacy(bookclub?.private);
        setDesc(bookclub?.description);
        setIconURL(bookclub?.icon);
    }, [bookclub]);

    useEffect(() => {
        if (!icon) return;

        try {
            const formData = new FormData();
            formData.append('icon', icon[0]);

            fetch(process.env.NEXT_PUBLIC_API_URL + 'bookclubs/upload', {
                method: 'PUT',
                headers: {
                    'authorization': 'Bearer ' + user.token,
                    'bookclub': bookclub._id,
                },
                body: formData
            })
                .then(res => res.json())
                .then(data => setIconURL(data.bookclub?.icon))
        } catch {
            alert('Erreur pendant le chargement de l\'image de profil.')
        }
    }, [icon]);

    const handleSave = async () => {
        try {
            let res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'bookclubs/modify', {
                method: 'PUT',
                headers: {
                    'authorization': 'Bearer ' + user.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: bookclub._id, name, description: desc, private: privacy })
            });
            const dataMod = await res.json();
            dataMod?.bookclub && alert('Modifications réussies');
        } catch {
            alert('Erreur pendant l\'enregistrement des modifications.')
        }
    };


    return (
        <div className={styles.tab0}>
            <div className={styles.iconContainer}>
                <label htmlFor="file-input">
                    <FontAwesomeIcon icon={faPen} className={styles.iconEdit} />
                    <img src={iconURL} alt={name} className={styles.icon} />
                </label>
                <input id="file-input" type="file" accept="image/*" onChange={(e) => setIcon(e.target.files)} />
            </div>

            <label htmlFor="name" className={styles.label}>Nom</label>
            <input id="name" name="name" onChange={(e) => setName(e.target.value)} value={name} autoComplete="off" className={styles.input} />

            <label htmlFor="desc" className={styles.label}>Description</label>
            <input id="desc" name="desc" onChange={(e) => setDesc(e.target.value)} value={desc} autoComplete="off" className={styles.input} />

            <label htmlFor="privacy" className={styles.label}>Privé</label>
            <input style={{ width: '24px' }} id="privacy" name="privacy" type='checkbox' onChange={(e) => setPrivacy(e.target.checked)} checked={privacy} className={styles.input} />

            <button onClick={handleSave} className={styles.saveBtn}>Enregistrer</button>
        </div>
    );
}

export default BookclubSettings;