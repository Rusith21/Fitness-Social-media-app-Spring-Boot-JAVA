import React from 'react';
import { Card, Image } from 'react-bootstrap';

function UserProfileDetails({ userId, name }) { 

    return (
        <Card className="shadow" style={{marginBottom: "25px"}}>
            <Image src="https://t4.ftcdn.net/jpg/05/31/79/83/360_F_531798391_XFz7gyPmDRTAfiEE5sRjFu5NpKrJt4rC.jpg" fluid style={{height: "470px"}}/>
            <div className="d-flex justify-content-center align-items-center">
                <Image src="https://imgv3.fotor.com/images/blog-cover-image/10-profile-picture-ideas-to-make-you-stand-out.jpg" roundedCircle style={{ width: '150px', height: '150px', marginTop: '-75px', border: '5px solid white' }} />
            </div>
            <Card.Body className="text-center">
                <Card.Title><h4>{name}</h4></Card.Title>
            </Card.Body>
        </Card>
    );
}

export default UserProfileDetails;