const Joi = require('joi');  // this module returns a class, so the first letter should be uppercase
// works with Joi @13.1.0 
const express = require('express'); // Best Practices: put all the "require" call on the top of the file. highlights the dependencies.
const app = express();

app.use(express.json());

const courses = [
  { id : 1, name: 'course1'},
  { id : 2, name: 'course2'},
  { id : 3, name: 'course3'},
];

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/api/courses', (req,res) => {
  res.send(courses);
});

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required()
  };
  return Joi.validate(course,schema);
}
 
app.post('/api/courses', (req,res) => {
  // Validate 
  // If invalid, return 400 - Bad request   
  const { error } = validateCourse(req.body);                    // modern Javascript object destructuring syntax for result.error
  if(error) return res.status(400).send(error.details[0].message);
    
  const course = {
      id: courses.length + 1,
      name: req.body.name
  };
  courses.push(course); 
  res.send(course);
});

app.put('api/courses/:id', (req,res) => {
                                                                  // Look up the course
                                                                  // If not existing, return 404
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('The course with the given ID was not Found.');
  
                                                                    // Validate
  const { error } = validateCourse(req.body);                       // modern Javascript for result.error
  if(error) return res.status(400).send(error.details[0].message);  // If invalid, return 400 - Bad request
  

  course.name = req.body.name;                                      // Update course
  res.send(course);                                                 // Return the updated course
});

app.delete('/api/courses/:id', (req,res) => {
  // Look up the course
  // Not existing, 404
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('The course with the given ID was not Found.');

  // Delete
  const index = courses.indexOf(course);
  courses.slice(index, 1);

  // Return the same course
  res.send(course);
});

app.get('/api/courses/:id', (req, res) => {
  // Look up the course
  // If not existing, return 404
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('The course with the given ID was not Found.');
  res.send(course);
});

// PORT

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to the port ${port}...`));
