<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	https://codeigniter.com/user_guide/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There are three reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router which controller/method to use if those
| provided in the URL cannot be matched to a valid route.
|
|	$route['translate_uri_dashes'] = FALSE;
|
| This is not exactly a route, but allows you to automatically route
| controller and method names that contain dashes. '-' isn't a valid
| class or method name character, so it requires translation.
| When you set this option to TRUE, it will replace ALL dashes in the
| controller and method URI segments.
|
| Examples:	my-controller/index	-> my_controller/index
|		my-controller/my-method	-> my_controller/my_method
*/

$route['default_controller'] = 'home';
$route['404_override'] = '';
$route['translate_uri_dashes'] = FALSE;

$route['api/auth/signup']['post'] = 'auth/signup';
$route['api/auth/login']['post'] = 'auth/login';
$route['api/auth/isEmailTaken']['post'] = 'auth/isEmailTaken';
$route['api/auth/isEmailTakenWhileEditing/(:num)']['post'] = 'auth/isEmailTakenWhileEditing/$1';
$route['api/auth/verifyJwtToken'] = 'auth/verifyJwtToken';

$route['api/user/getUserEnrolledCourses/(:num)'] = 'user/getUserEnrolledCourses/$1';
$route['api/user/getAllUsers'] = 'user/getAllUsers';
$route['api/user/getUserById/(:num)'] = 'user/getUserById/$1';
$route['api/user/updateUser/(:num)']['post'] = 'user/updateUser/$1';
$route['api/user/updateUserAccountInfo/(:num)']['post'] = 'user/updateUserAccountInfo/$1';
$route['api/user/suspendUser/(:num)'] = 'user/suspendUser/$1';
$route['api/user/getCourseActivityPercentages/(:num)'] = 'user/getCourseActivityPercentages/$1';
$route['api/user/getAllLatestLecturesByUserId/(:num)'] = 'user/getAllLatestLecturesByUserId/$1';
$route['api/user/getMonthlyActivity/(:num)'] = 'user/getMonthlyActivity/$1';
$route['api/user/nextUsernameChangeAvailableIn/(:num)'] = 'user/nextUsernameChangeAvailableIn/$1';

$route['api/course/getAllPublicCourses'] = 'course/getAllPublicCourses';
$route['api/course/getAllCourses'] = 'course/getAllCourses';
$route['api/course/createCourse']['post'] = 'course/createCourse';
$route['api/course/updateCourse/(:num)']['post'] = 'course/updateCourse/$1';
$route['api/course/getCourseById/(:num)'] = 'course/getCourseById/$1';
$route['api/course/getCourseLectures/(:num)'] = 'course/getCourseLectures/$1';
$route['api/course/deleteCourse/(:num)'] = 'course/deleteCourse/$1';

$route['api/lecture/getLectureById/(:num)'] = 'lecture/getLectureById/$1';
$route['api/lecture/createLecture/(:num)']['post'] = 'lecture/createLecture/$1';
$route['api/lecture/updateLecture/(:num)']['post'] = 'lecture/updateLecture/$1';
$route['api/lecture/deleteLecture/(:num)'] = 'lecture/deleteLecture/$1';
