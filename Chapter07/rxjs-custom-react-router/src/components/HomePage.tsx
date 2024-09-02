import { useRouter } from '../hooks/useRouter';

const HomePage = () => {
  const { navigate } = useRouter()
  
  return (
    <div>
      HomePage
      <button onClick={() => navigate('/about/123')}>Go to About</button>
    </div>
  )
}

export default HomePage