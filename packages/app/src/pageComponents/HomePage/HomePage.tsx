import { Page } from '@/app/pageUtils';

import PetTalker from './PetTalker';

const HomePage: Page = async () => {
  return (
    <>
      <PetTalker />
    </>
  );
};

export default HomePage;
