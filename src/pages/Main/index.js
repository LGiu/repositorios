import React, {useCallback, useEffect, useState} from 'react';
import {FaGithub, FaPlus, FaSpinner, FaBars, FaTrash} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import {Container, Form, SubmitButton, List, DeleteButton} from "./style";
import api from "../../services/api";

export default function Main() {

    const [newRopositorio, setNewRopositorio] = useState('');
    const [repositorios, setRepositorios] = useState([]);
    const [loading, setLoanding] = useState(false);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        const repoStorage = localStorage.getItem('repositorios');
        if (repoStorage) {
            setRepositorios(JSON.parse(repoStorage));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('repositorios', JSON.stringify(repositorios));
    }, [repositorios]);

    function handleInputChange(e) {
        setAlert(null);
        setNewRopositorio(e.target.value);
    }

    const handleInputSubmit = useCallback((e) => {
        e.preventDefault();

        async function submit() {
            setLoanding(true);
            setAlert(null);
            try {
                if (newRopositorio === '') {
                    throw new Error("Digite o repositório!");
                }
                if (repositorios.find(repo => repo.name === newRopositorio)) {
                    throw new Error("Repositório já existe na lista!");
                }

                const response = await api.get(`repos/${newRopositorio}`);

                const data = {
                    name: response.data.full_name,
                };

                setRepositorios([...repositorios, data]);
                setNewRopositorio('');
            } catch (e) {
                setAlert(true);
            } finally {
                setNewRopositorio('');
                setLoanding(false);
            }
        }

        submit();
    }, [newRopositorio, repositorios]);

    const handleDelete = useCallback((repo) => {
        const find = repositorios.filter(r => r.name !== repo);
        setRepositorios(find);
    }, [repositorios]);

    return (
        <Container>
            <FaGithub size={25}/>
            <h1>Meus Repositórios</h1>

            <Form onSubmit={handleInputSubmit} error={alert}>
                <input
                    type="text"
                    placeholder="Adicionar Repositórios"
                    value={newRopositorio}
                    onChange={handleInputChange}
                />

                <SubmitButton loading={loading ? 1 : 0}>
                    {
                        loading ? (
                            <FaSpinner color="#fff" size={14}/>
                        ) : (
                            <FaPlus color="#fff" size={14}/>
                        )
                    }
                </SubmitButton>
            </Form>

            <List>
                {
                    repositorios.map(repo => (
                        <li key={repo.name}>
                            <span>
                                <DeleteButton onClick={() => handleDelete(repo.name)}>
                                    <FaTrash size={14}/>
                                </DeleteButton>
                                {repo.name}
                            </span>
                            <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}>
                                <FaBars size={20}/>
                            </Link>
                        </li>
                    ))
                }
            </List>
        </Container>
    );
}
