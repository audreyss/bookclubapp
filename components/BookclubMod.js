import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useEffect, useRef } from 'react';
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import { styled } from "@mui/material/styles";
import styles from '../styles/BookclubSettings.module.css';



function BookclubMod(props) {
    const { follows, user } = props;
    const initialized = useRef(false);
    const [moderators, setModerators] = useState([]);
    const [users, setUsers] = useState([]);
    const [value, setValue] = useState(null);
    const size = 50;

    useEffect(() => {
        if (!follows || follows.length === 0 || initialized.current) return;

        const mods = follows.filter(follow => follow.role === 1);
        const users = follows.filter(follow => follow.role === 2);
        setModerators(mods);
        setUsers(users);
        initialized.current = true;
    }, [follows]);


    const handleDelete = async (id) => {
        const res = await fetch('http://localhost:3000/followers/deleteMod', {
            method: 'PUT',
            headers: {
                'authorization': 'Bearer ' + user.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ followId: id })
        });
        const data = await res.json();
        if (data.follower) {
            const modoFollow = moderators.find(mod => mod._id === id);
            setModerators(prev => prev.filter(mod => mod._id !== id));
            setUsers(prev => [...prev, { ...modoFollow, role: 2 }]);
        }
    };

    const handleAdd = async () => {
        const res = await fetch('http://localhost:3000/followers/addMod', {
            method: 'PUT',
            headers: {
                'authorization': 'Bearer ' + user.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ followId: value._id })
        });
        const data = await res.json();
        if (data.follower) {
            setUsers(prev => prev.filter(user => user._id !== value._id));
            setModerators(prev => [...prev, { ...value, role: 1 }]);
            setValue(null);
        }
    };


    const modsDisplay = moderators.length === 0 ? "Pas de modération en place." : moderators.map(mod => (
        <div key={mod._id} className={styles.rowUser}>
            <Avatar src={mod.id_user.icon} alt={mod.id_user.pseudo} variant="rounded" sx={{ width: size, height: size }} />
            {mod.id_user.pseudo}
            <FontAwesomeIcon icon={faXmark} className={styles.deleteBtn} onClick={(_) => handleDelete(mod._id)} />
        </div>
    ));


    const StyledAutocomplete = styled(Autocomplete)({
        "&.Mui-focused .MuiInputLabel-outlined": {
            color: 'var(--primary-color)'
        },
        "& .MuiAutocomplete-inputRoot": {
            color: 'var(--primary-color)'
        },
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: 'var(--primary-color)'
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: 'var(--primary-color)'
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: 'var(--primary-color)'
        },
        '.MuiAutocomplete-inputFocused': {
            border: 'none',
            color: 'var(--primary-color)'
        },
        '.MuiFormLabel-root': {
            color: 'var(--primary-color)'
        },
    });



    return (
        <div className={styles.tab1}>
            <h3>Gérer les modérateurs et modératrices</h3>
            {modsDisplay}

            <h3>Ajouter un membre à la modération</h3>
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', gap: '20px' }}>
                <StyledAutocomplete id="select-user" sx={{ width: 0.5 }}
                    options={users.sort((a, b) => -b.id_user.pseudo[0].localeCompare(a.id_user.pseudo[0]))} autoHighlight disableCloseOnSelect
                    getOptionLabel={(option) => option.id_user.pseudo} value={value} onChange={(event, newValue) => { setValue(newValue) }}
                    renderOption={(props, option) => {
                        const { key, ...optionProps } = props;
                        return (
                            <Box key={key} component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...optionProps}>
                                <Avatar loading="lazy" src={option.id_user.icon} alt={option.id_user.pseudo} variant="rounded" sx={{ width: 32, height: 32, mr: 2 }} />
                                {option.id_user.pseudo}
                            </Box>
                        );
                    }}
                    renderInput={(params) => <TextField {...params} label="Choisir un membre" />}
                />
                <button style={{ width: '40%' }} onClick={handleAdd}>Ajouter à la modération</button>
            </div>
        </div>
    );
}

export default BookclubMod;