import { useObservableState } from "observable-hooks";
import { useParams } from "../hooks/useParams";

const AboutPage = () => {
  const params$: any = useParams();
  const params = useObservableState(params$);

  return (
    <div>AboutPage
      {JSON.stringify(params)}
    </div>
  )
}

export default AboutPage