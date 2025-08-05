import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ArtifactAddPage from './pages/ArtifactAddPage';
import ModerationPage from './pages/ModerationPage';
import CharacterEditor from './components/Moderation/CharacterEditor';
import WeaponEditor from './components/Moderation/WeaponEditor';
import ArtifactEditor from './components/Moderation/ArtifactEditor';
import ImageUploader from './components/Moderation/ImageUploader';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ArtifactAddPage />} />
        <Route path="/moderation" element={<ModerationPage />} >
          <Route path="characters" element={<CharacterEditor />} />
          <Route path="weapons" element={<WeaponEditor />} />
          <Route path="artifacts" element={<ArtifactEditor />} />
          <Route path="image-upload" element={<ImageUploader />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
