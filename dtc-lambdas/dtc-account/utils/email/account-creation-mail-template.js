const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en-GB">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <style type="text/css">
        a[x-apple-data-detectors] {
            color: inherit !important;
        }
        body {
          font-family: "HelveticaNeue", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif
        }
    </style>
    <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>

<body style="margin: 0; padding: 0">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding: 20px 0 30px 0;">

                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="">
                    <tr>
                        <td align="center"style="padding:10px 15px 32px 15px;">
                           <table style="width: 100%;">
                               <tr>
                                   <td style="font-size: 64px; color: rgb(35, 35, 35);font-weight: bold;width:100%;line-height: 24px; text-align: center;">
                                    LOGO
                                   </td>
                               </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px 15px;font-size: 14px;color: rgb(35, 35, 35);line-height: 14px;">
                            Hello {{name}},
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0px 15px 20px 15px;font-size: 14px;color: rgb(35, 35, 35);line-height: 18px;">
                          Thank you for creating an account with {{brand_name}}! Visit {{brand_website}} to shop and view your account details.
                          If you have any questions please feel free to reach out to us at orders.brandname@parkstreet.com.
                        </td>
                    </tr>
                    <tr>
                      <td align="center" valign="middle" style="color: rgb(35, 35, 35);font-size: 7px;
                      font-weight: bold;background-color: rgba(0, 0, 0, 0.05);height: 46px;">
                        Copyright © 2007-2021 Brand Name, LLC. All Rights Reserved.
                      </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
module.exports = html;
