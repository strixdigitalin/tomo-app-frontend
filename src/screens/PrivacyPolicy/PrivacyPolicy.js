import React from 'react';
import LegalPage from './LegalPage';

const PrivacyPolicy = ({ navigation }) => (
  <LegalPage
    navigation={navigation}
    title="Privacy Policy"
    endpoint="/api/admin/GetPrivacyPolicy"
    field="PrivacyPolicy"
  />
);

export default PrivacyPolicy;
