import { useRouter } from '../hooks/useRouter';

const HomePage = () => {
  const { navigate } = useRouter()
  
  return (
    <div>
      HomePage
      <button onClick={() => navigate('/about')}>Go to About</button>
    </div>
  )
}

export default HomePage