import React, { Component } from 'react';
import SimpleSelect from '../SimpleSelect/SimpleSelect.js';
import OutlinedTextFields from '../OutlinedTextFields/OutlinedTextFields.js';
import InterestsInput from '../InterestsInput/InterestsInput.js';
import ImageGridList from '../ImageGridList/ImageGridList.js';

class Settings extends Component {
  render() {
    return (
      <div>
         <h1>Settings</h1>
        <SimpleSelect title='Gender' items={['Male', 'Female']} />
        <SimpleSelect title='Preferences' items={['Heterosexual', 'Homosexual', 'Bisexual']} />
        <OutlinedTextFields label='Biography' placeholder='Tell us a few words about yourself' />
        <InterestsInput
       />
        <ImageGridList />
      </div>
    );
  }
}

export default Settings;
