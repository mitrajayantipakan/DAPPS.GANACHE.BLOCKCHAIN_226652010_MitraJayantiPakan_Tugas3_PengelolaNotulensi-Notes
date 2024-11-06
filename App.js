import React, { useState, useEffect } from 'react';
import web3 from './web3';
import Notes from './contracts/Notes.json';

const App = () => {
    const [account, setAccount] = useState('');
    const [notes, setNotes] = useState([]);
    const [noteContent, setNoteContent] = useState('');

    useEffect(() => {
        const loadBlockchainData = async () => {
            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);

            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Notes.networks[networkId];
            const contract = new web3.eth.Contract(
                Notes.abi,
                deployedNetwork && deployedNetwork.address,
            );

            const notesCount = await contract.methods.notesCount().call();
            const notesArray = [];
            for (let i = 1; i <= notesCount; i++) {
                const note = await contract.methods.notes(i).call();
                notesArray.push(note);
            }
            setNotes(notesArray);
        };

        loadBlockchainData();
    }, []);

    const createNote = async () => {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Notes.networks[networkId];
        const contract = new web3.eth.Contract(
            Notes.abi,
            deployedNetwork && deployedNetwork.address,
        );

        await contract.methods.createNote(noteContent).send({ from: account });
        setNotes([...notes, { id: notes.length + 1, content: noteContent, author: account }]);
        setNoteContent('');
    };

    return (
        <div>
            <h1>Pengelola Notulensi (Notes)</h1>
            <div>
                <input
                    type="text"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Tulis catatan..."
                />
                <button onClick={createNote}>Tambah Catatan</button>
            </div>
            <ul>
                {notes.map((note, index) => (
                    <li key={index}>
                        {note.id}. {note.content} (Penulis: {note.author})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
