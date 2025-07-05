package com.example.refugee.rights.service;

import com.example.refugee.rights.model.Signature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendThankYouEmail(Signature signature){
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(signature.getEmail());
        message.setSubject("Thank You for Supporting Refugee Rights");
        message.setText("Dear " + signature.getName() + ",\n\nThank you for signing our petition to support refugee rights!" +
                "\n\nYour voice makes a difference.\n\n— Refugee Rights Team");

        mailSender.send(message);
    }

}
