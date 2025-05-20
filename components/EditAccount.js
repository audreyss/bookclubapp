import { useState } from "react";

function EditAccount(props) {
    const [value, setValue] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        console.log('Submit');
    }

    return (
        <div>
            <label htmlFor="field">{`Nouveau ${props.field}`}</label>
            <input type={props.type} id="field" name="field" placeholder={`nouveau ${props.field}`} onChange={(e) => setValue(e.target.value)} value={value} />

            <label htmlFor="mdp">Mot de passe</label>
            <input type="password" id="mdp" name="mdp" placeholder='mot de passe' onChange={(e) => setPassword(e.target.value)} value={password} />

            <button onClick={handleSubmit}>Créer un compte</button>
        </div>
    );
}

export default EditAccount;