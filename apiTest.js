const API_KEY = 'xDzK4Es7NP0bZzKHsd2Cgg==DWdfQQprD9OwIOhn';
const muscle = 'biceps';
const type = 'strength';

const url = `https://api.api-ninjas.com/v1/exercises?muscle=${muscle}&type=${type}`;

async function fetchExercises() {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Api-Key': API_KEY,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Exercises:', data);
  } catch (error) {
    console.error('Error fetching exercises:', error.message);
  }
}

fetchExercises();
