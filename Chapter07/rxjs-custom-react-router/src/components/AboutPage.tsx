import { useObservableState } from "observable-hooks";
import { useParams } from "../hooks/useParams";

const AboutPage = () => {
  const params$ = useParams();
  const { id } = useObservableState(params$, {});

  return (
    <div>
      AboutPage id param: {id}
    </div>
  )
}

export default AboutPage