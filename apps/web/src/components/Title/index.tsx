export interface TitleProp {
  title: string
}

const Title = ({ title }: TitleProp) => {
  return (
    <h2 className="border-b border-solid border-b-stone-300">{ title }</h2>
  );
}

export default Title;
