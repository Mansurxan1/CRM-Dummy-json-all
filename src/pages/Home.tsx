import { useState } from 'react';
import Users from './Users';
import Products from './Products';
import Carts from './Carts';
import AuthLogin from './AuthLogin';
import Posts from './Posts';
import Comments from './Comments';
import Todos from './Todos';

const Home = () => {
  const [activeTab, setActiveTab] = useState('users');

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <Users />;
      case 'products':
        return <Products />;
      case 'carts':
        return <Carts />;
      case 'auth':
        return <AuthLogin />;
      case 'posts':
        return <Posts />;
      case 'comments':
        return <Comments />;
      case 'todos':
        return <Todos />;
      default:
        return <Users />;
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">CRM Tizimi</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`p-2 rounded ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Foydalanuvchilar
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`p-2 rounded ${activeTab === 'products' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Mahsulotlar
        </button>
        <button
          onClick={() => setActiveTab('carts')}
          className={`p-2 rounded ${activeTab === 'carts' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Savatlar
        </button>
        <button
          onClick={() => setActiveTab('auth')}
          className={`p-2 rounded ${activeTab === 'auth' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Kirish
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          className={`p-2 rounded ${activeTab === 'posts' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Postlar
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          className={`p-2 rounded ${activeTab === 'comments' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Kommentlar
        </button>
        <button
          onClick={() => setActiveTab('todos')}
          className={`p-2 rounded ${activeTab === 'todos' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Vazifalar
        </button>
      </div>

      {renderContent()}
    </div>
  );
};

export default Home;