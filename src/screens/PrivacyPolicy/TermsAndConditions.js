import React from 'react';
import LegalPage from './LegalPage';

const TermsAndConditions = ({ navigation }) => (
  <LegalPage
    navigation={navigation}
    title="Terms & Conditions"
    endpoint="/api/admin/GetTermsandcondition"
    field="Termsandcondition"
  />
);

export default TermsAndConditions;
