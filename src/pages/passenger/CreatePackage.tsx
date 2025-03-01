// src/pages/passenger/CreatePackage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  Box, Button, FormControl, FormLabel, Input, Textarea,
  FormErrorMessage, Heading, VStack, useToast, NumberInput,
  NumberInputField, NumberInputStepper, NumberIncrementStepper,
  NumberDecrementStepper
} from '@chakra-ui/react';
import { createPackage, PackageData } from '../../api/packages';

interface PackageFormValues extends PackageData {}

const CreatePackageSchema = Yup.object().shape({
  recipientName: Yup.string().required('Recipient name is required'),
  recipientPhone: Yup.string().required('Recipient phone is required'),
  recipientEmail: Yup.string().email('Invalid email').required('Recipient email is required'),
  pickupLocation: Yup.string().required('Pickup location is required'),
  deliveryLocation: Yup.string().required('Delivery location is required'),
  description: Yup.string().required('Package description is required'),
  estimatedValue: Yup.number()
    .required('Estimated value is required')
    .min(0, 'Value must be positive')
    .typeError('Amount must be a number'),
});

const CreatePackage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (values: PackageFormValues) => {
    setIsSubmitting(true);
    try {
      console.log('Sending package data:', values); // Debug log
      
      // Convert estimatedValue to a number if it's a string
      const packageData = {
        ...values,
        estimatedValue: typeof values.estimatedValue === 'string' 
          ? parseFloat(values.estimatedValue) 
          : values.estimatedValue
      };
      
      await createPackage(packageData);
      
      toast({
        title: 'Package created!',
        description: 'Your package delivery request has been created successfully.',
        status: 'success',
        duration: 5000,
      });
      
      navigate('/passenger/packages');
    } catch (error: any) {
      console.error('Package creation error:', error.response?.data || error); // Debug
      
      toast({
        title: 'Failed to create package',
        description: error.response?.data?.message || error.response?.data?.error || 'An error occurred',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Box maxW="lg" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Heading mb={6} size="lg">Create Package Delivery Request</Heading>
      
      <Formik
        initialValues={{
          recipientName: '',
          recipientPhone: '',
          recipientEmail: '',
          pickupLocation: '',
          deliveryLocation: '',
          description: '',
          estimatedValue: 0,
        }}
        validationSchema={CreatePackageSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <Form>
            <VStack spacing={4} align="stretch">
              <FormControl isInvalid={!!errors.recipientName && !!touched.recipientName}>
                <FormLabel>Recipient Name</FormLabel>
                <Field as={Input} id="recipientName" name="recipientName" />
                <FormErrorMessage>{errors.recipientName}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={!!errors.recipientPhone && !!touched.recipientPhone}>
                <FormLabel>Recipient Phone</FormLabel>
                <Field as={Input} id="recipientPhone" name="recipientPhone" />
                <FormErrorMessage>{errors.recipientPhone}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={!!errors.recipientEmail && !!touched.recipientEmail}>
                <FormLabel>Recipient Email</FormLabel>
                <Field as={Input} id="recipientEmail" name="recipientEmail" type="email" />
                <FormErrorMessage>{errors.recipientEmail}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={!!errors.pickupLocation && !!touched.pickupLocation}>
                <FormLabel>Pickup Location</FormLabel>
                <Field as={Input} id="pickupLocation" name="pickupLocation" />
                <FormErrorMessage>{errors.pickupLocation}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={!!errors.deliveryLocation && !!touched.deliveryLocation}>
                <FormLabel>Delivery Location</FormLabel>
                <Field as={Input} id="deliveryLocation" name="deliveryLocation" />
                <FormErrorMessage>{errors.deliveryLocation}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={!!errors.description && !!touched.description}>
                <FormLabel>Package Description</FormLabel>
                <Field as={Textarea} id="description" name="description" />
                <FormErrorMessage>{errors.description}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={!!errors.estimatedValue && !!touched.estimatedValue}>
                <FormLabel>Estimated Value (RWF)</FormLabel>
                <NumberInput
                  min={0}
                  onChange={(valueString) => setFieldValue('estimatedValue', parseFloat(valueString))}
                  value={values.estimatedValue}
                >
                  <NumberInputField name="estimatedValue" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>{errors.estimatedValue}</FormErrorMessage>
              </FormControl>
              
              <Button
                mt={6}
                colorScheme="blue"
                isLoading={isSubmitting}
                type="submit"
                width="full"
              >
                Create Package Request
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default CreatePackage;