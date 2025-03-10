import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  Box, Button, FormControl, FormLabel, Input, 
  FormErrorMessage, Heading, VStack, useToast, Divider
} from '@chakra-ui/react';
import { registerPassenger } from '../../api/auth';

// Define an interface that matches your backend expectations
interface PassengerFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string; // Matches backend
  ResidencyAddress: string; // Matches backend (with capital R)
  password: string;
  confirmPassword: string;
}

const RegisterSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  ResidencyAddress: Yup.string().required('Residency address is required'), 
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const RegisterPassenger = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (values: PassengerFormValues) => {
    if (values.password !== values.confirmPassword) {
      toast({
        title: 'Passwords do not match',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...passengerData } = values;
      
      console.log('Sending passenger data:', passengerData); // Debug
      
      await registerPassenger(passengerData);
      
      toast({
        title: 'Registration successful!',
        description: 'You can now log in with your credentials',
        status: 'success',
        duration: 5000,
      });
      
      navigate('/auth/login');
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error); // Debug
      
      toast({
        title: 'Registration failed',
        description: error.response?.data?.message || error.response?.data?.error || 'An error occurred',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Heading mb={6} textAlign="center">Register as Passenger</Heading>
      
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '', // Changed from phone to phoneNumber
          ResidencyAddress: '', // Ensure this matches backend (with capital R)
          password: '',
          confirmPassword: ''
        }}
        validationSchema={RegisterSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.firstName && !!touched.firstName}>
                <FormLabel>First Name</FormLabel>
                <Field as={Input} id="firstName" name="firstName" />
                <FormErrorMessage>{errors.firstName}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={!!errors.lastName && !!touched.lastName}>
                <FormLabel>Last Name</FormLabel>
                <Field as={Input} id="lastName" name="lastName" />
                <FormErrorMessage>{errors.lastName}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={!!errors.email && !!touched.email}>
                <FormLabel>Email</FormLabel>
                <Field as={Input} id="email" name="email" type="email" />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={!!errors.phoneNumber && !!touched.phoneNumber}>
                <FormLabel>Phone Number</FormLabel>
                <Field as={Input} id="phoneNumber" name="phoneNumber" />
                <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={!!errors.ResidencyAddress && !!touched.ResidencyAddress}>
                <FormLabel>Residency Address</FormLabel>
                <Field as={Input} id="ResidencyAddress" name="ResidencyAddress" />
                <FormErrorMessage>{errors.ResidencyAddress}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={!!errors.password && !!touched.password}>
                <FormLabel>Password</FormLabel>
                <Field as={Input} id="password" name="password" type="password" />
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={!!errors.confirmPassword && !!touched.confirmPassword}>
                <FormLabel>Confirm Password</FormLabel>
                <Field as={Input} id="confirmPassword" name="confirmPassword" type="password" />
                <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
              </FormControl>
              
              <Button
                mt={6}
                colorScheme="blue"
                isLoading={isSubmitting}
                type="submit"
                width="full"
              >
                Register
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
      
      <Divider my={6} />
      
      <Box textAlign="center">
        <Button variant="link" onClick={() => navigate('/auth/login')}>
          Already have an account? Sign in
        </Button>
      </Box>
    </Box>
  );
};

export default RegisterPassenger;