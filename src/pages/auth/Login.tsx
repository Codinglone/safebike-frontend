// src/pages/auth/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  Box, Button, FormControl, FormLabel, Input, 
  FormErrorMessage, Heading, VStack, RadioGroup, 
  Radio, Stack, useToast 
} from '@chakra-ui/react';
import { login } from '../../api/auth';
import { useAuth } from '../../contexts/AuthContexts';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
  userType: Yup.string().oneOf(['passenger', 'rider'], 'User type is required').required('User type is required'),
});

const Login = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const response = await login(values.email, values.password, values.userType);
      authLogin(response.user, response.token);
      
      toast({
        title: 'Login successful!',
        status: 'success',
        duration: 3000,
      });
      
      // Redirect based on user type
      if (values.userType === 'passenger') {
        navigate('/passenger');
      } else if (values.userType === 'rider') {
        navigate('/rider');
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error.response?.data?.error || 'An error occurred',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Heading mb={6} textAlign="center">Login</Heading>
      <Formik
        initialValues={{ email: '', password: '', userType: 'passenger' }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <VStack spacing={4}>
              <FormControl isInvalid={errors.email && touched.email}>
                <FormLabel>Email</FormLabel>
                <Field as={Input} id="email" name="email" type="email" />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={errors.password && touched.password}>
                <FormLabel>Password</FormLabel>
                <Field as={Input} id="password" name="password" type="password" />
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={errors.userType && touched.userType}>
                <FormLabel>I am a:</FormLabel>
                <Field name="userType">
                  {({ field }) => (
                    <RadioGroup {...field}>
                      <Stack direction="row">
                        <Radio value="passenger">Passenger</Radio>
                        <Radio value="rider">Rider</Radio>
                      </Stack>
                    </RadioGroup>
                  )}
                </Field>
                <FormErrorMessage>{errors.userType}</FormErrorMessage>
              </FormControl>
              
              <Button
                colorScheme="blue"
                isLoading={isSubmitting}
                type="submit"
                width="full"
                mt={4}
              >
                Login
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
      
      <Box mt={4} textAlign="center">
        <Button variant="link" onClick={() => navigate('/auth/register/passenger')}>
          Register as Passenger
        </Button>
        {' | '}
        <Button variant="link" onClick={() => navigate('/auth/register/rider')}>
          Register as Rider
        </Button>
      </Box>
    </Box>
  );
};

export default Login;